/**
 * ToggleInput - Multi-select with toggle to switch to free text
 *
 * User feedback: "you can have an open box and just a toggle where it says 'Options'
 * so that if they want to type it in they can and if they want to choose from a box they can"
 */

interface ToggleInputProps {
  label: string;
  selectedOptions: string[];
  textValue: string;
  useTextInput: boolean;
  options: string[];
  onOptionsChange: (selected: string[]) => void;
  onTextChange: (text: string) => void;
  onToggle: (useText: boolean) => void;
}

export function ToggleInput({
  label,
  selectedOptions,
  textValue,
  useTextInput,
  options,
  onOptionsChange,
  onTextChange,
  onToggle,
}: ToggleInputProps) {
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onOptionsChange(selectedOptions.filter((s) => s !== option));
    } else {
      onOptionsChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => onToggle(!useTextInput)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {useTextInput ? (
            <>
              <span>Show options</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </>
          ) : (
            <>
              <span>Type instead</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </>
          )}
        </button>
      </div>

      {useTextInput ? (
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Describe in your own words..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedOptions.includes(option)
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
