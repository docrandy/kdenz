# ============================================================================
# INBOX SCANNER AGENT: Detect and catalog new files in docs/_inbox/
# ============================================================================
#
# PURPOSE:
#   Scans the docs/_inbox/ folder for new files, logs their arrival,
#   and produces a pending.json manifest for Claude to consume.
#
# WHAT IT DOES:
#   1. Scans _inbox/ for all files (excludes itself)
#   2. Compares against pending.json to identify new arrivals
#   3. Logs new arrivals to log/intake_log.txt
#   4. Updates log/pending.json with new entries (status: "pending")
#   5. Outputs scan summary to console
#
# WHEN IT RUNS:
#   - On-demand: .\inbox-scanner.ps1
#   - Called by Claude Code before processing inbox items
#   - Called by user after dropping files into _inbox/
#
# CREATED: 2026-02-04
#
# ============================================================================

# Configuration
$DocsRoot = "C:\Users\randy\.claude\projects\kdenz\docs"
$InboxDir = "$DocsRoot\_inbox"
$LogDir = "$DocsRoot\log"
$LogFile = "$LogDir\intake_log.txt"
$ManifestFile = "$LogDir\pending.json"
$ExcludeFiles = @("inbox-scanner.ps1")

# ============================================================================
# Logging
# ============================================================================

function Write-InboxLog {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "$Timestamp | $Level | $Message"

    # Ensure log directory exists
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }

    Add-Content -Path $LogFile -Value $LogEntry
    Write-Host $LogEntry
}

# ============================================================================
# Manifest Operations
# ============================================================================

function Get-PendingManifest {
    if (Test-Path $ManifestFile) {
        try {
            $content = Get-Content -Path $ManifestFile -Raw
            if ([string]::IsNullOrWhiteSpace($content)) {
                return @{ last_scan = $null; items = @() }
            }
            return $content | ConvertFrom-Json
        }
        catch {
            Write-InboxLog "Failed to read pending.json: $($_.Exception.Message)" "WARN"
            return @{ last_scan = $null; items = @() }
        }
    }
    return @{ last_scan = $null; items = @() }
}

function Save-PendingManifest {
    param($Manifest)

    # Ensure log directory exists
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }

    $Manifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $ManifestFile -Encoding UTF8
}

# ============================================================================
# Inbox Scanning
# ============================================================================

function Get-InboxFiles {
    if (-not (Test-Path $InboxDir)) {
        Write-InboxLog "Inbox directory does not exist: $InboxDir" "ERROR"
        return @()
    }

    $files = Get-ChildItem -Path $InboxDir -File | Where-Object {
        $ExcludeFiles -notcontains $_.Name
    }

    $fileList = @()
    foreach ($file in $files) {
        $fileList += @{
            filename = $file.Name
            extension = $file.Extension.ToLower()
            size_bytes = $file.Length
            last_modified = $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
        }
    }

    return $fileList
}

function Invoke-InboxScan {
    Write-InboxLog "Inbox scan started"

    # Get current inbox files
    $inboxFiles = Get-InboxFiles

    if ($inboxFiles.Count -eq 0) {
        Write-InboxLog "No files found in _inbox/ (empty)"
        Write-Host ""
        Write-Host "INBOX SCAN COMPLETE" -ForegroundColor Cyan
        Write-Host "===================" -ForegroundColor Cyan
        Write-Host "Files in inbox: 0"
        Write-Host "New files: 0"

        # Still update manifest timestamp
        $manifest = Get-PendingManifest
        $manifest.last_scan = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        Save-PendingManifest $manifest
        return
    }

    # Load existing manifest
    $manifest = Get-PendingManifest
    $existingFilenames = @()
    if ($manifest.items) {
        $existingFilenames = $manifest.items | Where-Object { $_.status -ne "removed" } | ForEach-Object { $_.filename }
    }

    # Initialize items array if needed
    if (-not $manifest.items) {
        $manifest | Add-Member -NotePropertyName "items" -NotePropertyValue @() -Force
    }

    # Find new files
    $newCount = 0
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    foreach ($file in $inboxFiles) {
        if ($existingFilenames -notcontains $file.filename) {
            # New file detected
            $newCount++
            $sizeFormatted = if ($file.size_bytes -gt 1048576) {
                "{0:N1} MB" -f ($file.size_bytes / 1048576)
            } elseif ($file.size_bytes -gt 1024) {
                "{0:N1} KB" -f ($file.size_bytes / 1024)
            } else {
                "$($file.size_bytes) bytes"
            }

            Write-InboxLog "New file detected: $($file.filename) ($sizeFormatted)"

            # Warn on large files
            if ($file.size_bytes -gt 1048576) {
                Write-InboxLog "Large file warning: $($file.filename) is over 1 MB" "WARN"
            }

            # Note on docx files
            if ($file.extension -eq ".docx") {
                Write-InboxLog "DOCX format: $($file.filename) - may require conversion for processing" "INFO"
            }

            # Add to manifest
            $newItem = @{
                filename = $file.filename
                extension = $file.extension
                size_bytes = $file.size_bytes
                detected_at = $timestamp
                status = "pending"
                processing_started = $null
                processing_completed = $null
                outputs = @()
                notes = $null
            }

            # Convert items to mutable array and add
            $itemsList = [System.Collections.ArrayList]@()
            if ($manifest.items) {
                foreach ($existing in $manifest.items) {
                    $itemsList.Add($existing) | Out-Null
                }
            }
            $itemsList.Add($newItem) | Out-Null
            $manifest.items = $itemsList.ToArray()
        }
    }

    # Check for removed files (in manifest but no longer in inbox)
    if ($manifest.items) {
        foreach ($item in $manifest.items) {
            $stillExists = $inboxFiles | Where-Object { $_.filename -eq $item.filename }
            if (-not $stillExists -and $item.status -eq "pending") {
                $item.status = "removed"
                Write-InboxLog "File removed from inbox before processing: $($item.filename)" "WARN"
            }
        }
    }

    # Update scan timestamp
    $manifest.last_scan = $timestamp

    # Save manifest
    try {
        Save-PendingManifest $manifest
        $pendingCount = ($manifest.items | Where-Object { $_.status -eq "pending" }).Count
        Write-InboxLog "pending.json updated: $newCount new entries (total: $pendingCount pending)" "SUCCESS"
    }
    catch {
        Write-InboxLog "Failed to save pending.json: $($_.Exception.Message)" "ERROR"
    }

    # Console summary
    $pendingCount = ($manifest.items | Where-Object { $_.status -eq "pending" }).Count
    $processedCount = ($manifest.items | Where-Object { $_.status -eq "processed" }).Count

    Write-Host ""
    Write-Host "INBOX SCAN COMPLETE" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "Files in inbox: $($inboxFiles.Count)"
    Write-Host "New files: $newCount"
    Write-Host "Total pending: $pendingCount" -ForegroundColor Yellow
    Write-Host "Total processed: $processedCount" -ForegroundColor Green

    if ($pendingCount -gt 0) {
        Write-Host ""
        Write-Host "Pending files:" -ForegroundColor Yellow
        foreach ($item in ($manifest.items | Where-Object { $_.status -eq "pending" })) {
            Write-Host "  - $($item.filename)" -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "Run 'process inbox' in Claude Code to process these files." -ForegroundColor Cyan
    }
}

# ============================================================================
# Execute
# ============================================================================

if ($MyInvocation.InvocationName -ne '.') {
    Invoke-InboxScan
}
