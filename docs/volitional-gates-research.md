![](media/image1.png){width="2.6466666666666665in"
height="0.6666666666666666in"}

**I am building a behavioral model that distinguishes between two
categories of constraints on goal-directed action: (A) INPUT CONSTRAINTS
--- where the constraint exists in the body or environment and persists
regardless of the person\'s motivational or cognitive state (e.g.,
physical disability, resource absence, environmental barriers), and (B)
PROCESSING CONSTRAINTS --- where the constraint is a property of the
brain\'s evaluative system itself and can be altered by changing what
the brain computes (e.g., low self-efficacy, poor planning, weak
commitment). The key test: if you hypothetically set motivation to
maximum, input constraints still block action; processing constraints
are removed by definition. Is there established neuroscience or
behavioral science literature that supports this distinction?
Specifically: (1) Does the neuroscience of basal ganglia gating (Frank
2005, 2025; Ging-Jehli et al. 2025) support a distinction between
constraints on the INPUTS to the gating system vs. constraints in the
COMPUTATION of the gating decision? (2) Does the COM-B model\'s
Capability-Opportunity-Motivation framework map onto this
input/processing distinction, and if so, how? (3) Are there established
frameworks in philosophy of action (e.g., Frankfurt\'s hierarchy of
desires, Bratman\'s planning theory) or cognitive neuroscience that
formally separate \"can\'t act because the world won\'t allow it\" from
\"can\'t act because the evaluative system outputs \'don\'t\'\"? Cite
primary sources.**

There is substantial convergent support for the distinction you are
drawing, but it is spread across several literatures rather than living
under a single name. In very compact form:

- Cortico--basal ganglia models and diffusion decision models clearly
  separate constraints on **inputs/evidence** from constraints in the
  **gating computation** (e.g., decision threshold, urgency), and assign
  different neural mechanisms to
  each.[^[\[1\]]{.underline}^](#fn1)[^[\[2\]]{.underline}^](#fn2)[^[\[3\]]{.underline}^](#fn3)[^[\[4\]]{.underline}^](#fn4)

- The COM-B / Behaviour Change Wheel literature explicitly treats
  **capability** and **opportunity** as "logic gates" on behaviour that
  are distinct from **motivation**, which it defines as the brain's
  evaluative/motivational
  processes.[^[\[5\]]{.underline}^](#fn5)[^[\[6\]]{.underline}^](#fn6)[^[\[7\]]{.underline}^](#fn7)

- Philosophy of action, rational choice theory, and some comparative
  cognition work all distinguish between **constraints on what is
  feasible** ("can't") and **constraints in the will or evaluative
  system**
  ("won't").[^[\[8\]]{.underline}^](#fn8)[^[\[9\]]{.underline}^](#fn9)[^[\[10\]]{.underline}^](#fn10)[^[\[11\]]{.underline}^](#fn11)

So your input vs processing constraint distinction is well-aligned with
how these fields already carve things up, even if the terminology
differs.

**(1) Basal ganglia gating: inputs vs computation**

**Frank-style cortico--basal ganglia models**

Frank's 2005 model and related work explicitly separates:

- **Inputs into the basal ganglia gate**

  - Cortical representations of states, actions, and their learned
    values.

  - Dopamine-coded reward prediction errors that train striatal Go/NoGo
    weights via reinforcement
    learning.[^[\[12\]]{.underline}^](#fn12)[^[\[2\]]{.underline}^](#fn2)[^[\[13\]]{.underline}^](#fn13)

- **Gating computation itself**

  - Competitive dynamics between striatal "Go" (direct pathway) and
    "NoGo" (indirect pathway) populations, whose net effect on GPi
    disinhibits or inhibits thalamo--cortical loops (i.e., opens or
    keeps closed the gate to an
    action).[^[\[14\]]{.underline}^](#fn14)[^[\[2\]]{.underline}^](#fn2)[^[\[13\]]{.underline}^](#fn13)

  - Additional control from STN, which can dynamically raise the
    effective decision threshold under
    conflict.[^[\[4\]]{.underline}^](#fn4)[^[\[15\]]{.underline}^](#fn15)

Conceptually, these are two separable levels:

- If cortical representations lack an action, the sensory evidence is
  too weak, or values are mislearned, then **the inputs to the gating
  system are constrained** (no candidate to gate, or poor evidence for
  it), even if the gate itself is functioning normally.

- Conversely, with intact inputs, changes in tonic or phasic dopamine,
  STN activity, or GPi output can alter how readily the system commits
  to an action---**a constraint in the computation of the
  gate**.[^[\[2\]]{.underline}^](#fn2)[^[\[13\]]{.underline}^](#fn13)[^[\[15\]]{.underline}^](#fn15)[^[\[4\]]{.underline}^](#fn4)

That is very close to your input vs processing distinction: the BG gate
is a modulatory decision device that operates on whatever
representations it receives.

**Drift vs threshold in diffusion models mapped to BG circuitry**

Newer work explicitly decomposes decision behaviour into:

- **Drift rate:** quality/strength of incoming evidence (often tied to
  sensory and value inputs).

- **Decision threshold (boundary):** the amount of evidence the system
  requires before committing to a choice (a policy of caution vs
  urgency).[^[\[16\]]{.underline}^](#fn16)

The key BG results:

- Dunovan et al. (2015) model reactive stopping vs intrinsic "no-go"
  decisions using a nested diffusion model grounded in BG anatomy.
  Hyperdirect STN activity supports fast cancellation of a pending
  action; "no-go" decisions are better captured as a **failure of
  evidence accumulation to reach threshold** due to constraints on drift
  rate.[^[\[17\]]{.underline}^](#fn17)[^[\[18\]]{.underline}^](#fn18)

- Ging-Jehli et al. (2025) and related work record from STN, GPe, GPi in
  humans and fit diffusion models with *collapsing* decision boundaries.
  They
  show:[^[\[19\]]{.underline}^](#fn19)[^[\[3\]]{.underline}^](#fn3)[^[\[20\]]{.underline}^](#fn20)[^[\[1\]]{.underline}^](#fn1)

  - Stimulus discriminability modulates drift rate (input quality).

  - Theta-band dynamics in STN and GPe modulate **the onset and shape of
    the collapsing decision boundary**, i.e., how high the required
    evidence starts and how fast it
    relaxes.[^[\[3\]]{.underline}^](#fn3)[^[\[21\]]{.underline}^](#fn21)

  - STN theta prolongs high boundaries under conflict (more cautious,
    slower but more accurate); GPe theta reductions under low conflict
    expedite boundary collapse (less cautious, faster choices); GPi
    theta uniformly delays boundary collapse as final output
    gate.[^[\[20\]]{.underline}^](#fn20)[^[\[1\]]{.underline}^](#fn1)[^[\[3\]]{.underline}^](#fn3)

Here the mapping is almost literal:

- **Input constraints (in your sense):** low discriminability, weak or
  noisy cortical evidence, or mislearned value signals reduce the drift
  rate. Even with a normal decision threshold, the system may rarely
  trigger a Go because evidence never accumulates
  enough.[^[\[18\]]{.underline}^](#fn18)[^[\[17\]]{.underline}^](#fn17)[^[\[16\]]{.underline}^](#fn16)

- **Processing constraints:** increasing STN-driven threshold,
  prolonging the collapsing boundary, or pathology in GPi output
  increases the evidence required for gating. Behaviour is suppressed or
  slowed, even when inputs (drift) are unchanged and "motivation" in the
  value signals is
  high.[^[\[22\]]{.underline}^](#fn22)[^[\[23\]]{.underline}^](#fn23)[^[\[3\]]{.underline}^](#fn3)[^[\[4\]]{.underline}^](#fn4)

In the "set motivation to maximum" thought experiment:

- Raising motivation through value signals would typically be modelled
  as increasing drift in favour of the action (e.g., larger value
  difference between options).

- If the gate still does not open because threshold remains
  pathologically high or GPi output cannot be sufficiently inhibited,
  the failure is squarely in **the gating computation**, not the
  inputs---matching your processing constraint category.

**BG as a gate on thalamo--cortical loops**

The O'Reilly & Munakata text summarizes the basal ganglia as a **gate**
on thalamo--cortical loops, with Go firing opening the gate and NoGo
firing closing it across motor and prefrontal circuits. Inputs
include:[^[\[14\]]{.underline}^](#fn14)

- Cortical representations of current state, potential actions, stimulus
  identity, reward value, and action costs from areas like OFC and
  ACC.[^[\[14\]]{.underline}^](#fn14)

Gating dynamics---Go/NoGo balance, STN-mediated threshold control, GPi
output---then determine whether a given loop is updated (cognitive or
motor "action
selection").[^[\[13\]]{.underline}^](#fn13)[^[\[15\]]{.underline}^](#fn15)[^[\[14\]]{.underline}^](#fn14)

Again, the theory already treats:

- **"The world and body" at the representational level** (what
  states/actions/values get into cortex and striatum) as distinct from

- **"The decision policy" in the gate** (learning rules and state of BG
  circuitry that determine when those representations drive behaviour).

So, while Frank or Ging-Jehli do not use your exact terminology, their
models strongly support a clean analytic distinction between constraints
on **inputs to the gating system** and constraints in the **computation
of the gating decision**.

**(2) Mapping COM-B to input vs processing constraints**

The original Behaviour Change Wheel / COM-B paper by Michie et al.
defines:

- **Capability:** "the individual's psychological and physical capacity
  to engage in the activity concerned... having the necessary knowledge
  and skills."[^[\[5\]]{.underline}^](#fn5)

- **Opportunity:** "all the factors that lie outside the individual that
  make the behaviour possible or prompt
  it."[^[\[5\]]{.underline}^](#fn5)

- **Motivation:** "all those brain processes that energize and direct
  behaviour, not just goals and conscious decision-making... habitual
  processes, emotional responding, as well as analytical
  decision-making."[^[\[5\]]{.underline}^](#fn5)

West's short COM-B/PRIME introduction goes further and makes the "logic
gate" idea explicit:

- At a moment-to-moment level, **capability and opportunity "act like
  logic gates"**: both must be open for motivation to generate
  behaviour.[^[\[6\]]{.underline}^](#fn6)

- Aggregated over time, greater capability and opportunity increase the
  probability that when motivation is present, the gates are open and
  behaviour can occur.[^[\[6\]]{.underline}^](#fn6)

Other expositions (e.g., Habit Weekly, Social Change UK) emphasize
similar structure:

- Physical capability = bodily skills/strength; psychological capability
  = knowledge and cognitive skills such as attention and
  memory.[^[\[7\]]{.underline}^](#fn7)[^[\[24\]]{.underline}^](#fn24)

- Physical opportunity = time, money, physical resources, environmental
  layout; social opportunity = norms, social
  support.[^[\[25\]]{.underline}^](#fn25)[^[\[7\]]{.underline}^](#fn7)[^[\[5\]]{.underline}^](#fn5)

- Motivation is subdivided into reflective (beliefs, evaluations,
  intentions) and automatic (emotions,
  habits).[^[\[26\]]{.underline}^](#fn26)[^[\[7\]]{.underline}^](#fn7)

**Direct mapping**

With your categories, COM-B maps naturally as:

- **Input constraints (A)**

  - **Physical capability:** physical disability, strength, stamina
    constraints, motor skill deficits---these are constraints in the
    body that persist regardless of motivation.

  - **Psychological capability:** lacking necessary knowledge or
    cognitive skills; even with maximal motivation, a person cannot
    perform a complex procedure if they literally do not know how. COM-B
    treats this as *capability*, not
    motivation.[^[\[7\]]{.underline}^](#fn7)[^[\[5\]]{.underline}^](#fn5)

  - **Physical opportunity:** absence of resources, time, or
    environmental access; structural barriers (no bike, unsafe
    neighbourhood for running, no clinic
    nearby).[^[\[27\]]{.underline}^](#fn27)[^[\[25\]]{.underline}^](#fn25)

  - **Social opportunity:** absence of supportive norms or presence of
    prohibitive norms (legal bans, ostracism); these are constraints in
    the social
    environment.[^[\[7\]]{.underline}^](#fn7)[^[\[5\]]{.underline}^](#fn5)

- All of these are, in COM-B terms, **conditions that must be satisfied
  before motivation can "pass through" to action**, matching your notion
  that "if motivation were set to maximum, input constraints still block
  action."[^[\[6\]]{.underline}^](#fn6)

- **Processing constraints (B)**

  - **Motivation (reflective + automatic):** beliefs about outcomes and
    one's own capabilities, goals, values, habits, emotional responses,
    and impulses---all "brain processes that energise and direct
    behaviour."[^[\[7\]]{.underline}^](#fn7)[^[\[5\]]{.underline}^](#fn5)

  - Low self-efficacy, weak intentions, poor commitment, competing
    habits, or maladaptive emotional responses are explicitly classified
    here as **motivational**, not capability or
    opportunity.[^[\[25\]]{.underline}^](#fn25)[^[\[5\]]{.underline}^](#fn5)

- These can be altered by changing what the evaluative/motivational
  system computes (e.g., reframing outcomes, strengthening identity
  congruence, habit formation). Under your test, raising motivation to
  maximum removes these constraints by definition.

**A nuance about "psychological capability"**

One subtlety: COM-B's "psychological capability" includes not only
declarative knowledge but *mental skills such as attention, memory, and
decision-making skills*. Some of these border on what you might wish to
treat as processing capacities rather than static
inputs.[^[\[7\]]{.underline}^](#fn7)

For your purposes, you could:

- Classify **stable cognitive resources** (working memory capacity,
  attentional control limits, acquired procedural skills) as
  *input-like* constraints: even maximal motivation cannot conjure
  skills or capacity that are not present.

- Reserve **strategic misallocation and evaluation** (e.g., poor
  planning because the agent does not deploy existing skills, or
  distorted evaluation of consequences) for *processing* constraints.

The COM-B and BCW papers are agnostic about that fine-grained split;
they primarily want a tripartite decomposition in which **capability and
opportunity are constraints on whether motivation can express itself**,
and **motivation is the evaluative/energizing machinery**. That is
exactly the structure you are
using.[^[\[6\]]{.underline}^](#fn6)[^[\[5\]]{.underline}^](#fn5)

**(3) "Can't because the world won't allow it" vs "can't because the
evaluative system says don't"**

Several established frameworks make essentially your distinction, again
with different labels.

**Compatibilist tradition and Frankfurt's hierarchy**

The compatibilist tradition, as summarized in the SEP entry, decomposes
free action into:

- A **positive component**: "doing what one wills, desires, or inclines
  to do."

- A **negative component**: "acting unencumbered or unimpeded," where
  impediments are paradigmatically external compulsions, coercion, or
  physical constraints.[^[\[8\]]{.underline}^](#fn8)

On this view:

- If a person has a settled desire to φ but is physically restrained,
  intimidated, or otherwise barred, then they **"can't" act because the
  world will not allow it**, even though the will points toward φ.

- If the same external impediments are removed, but
  all-things-considered the person does not want to φ, then they
  **"won't" act because the will outputs 'don't'**, even though the
  world would permit it.

Frankfurt's own work introduces:

- A distinction between **freedom of action** (the absence of external
  impediments to doing what one wants) and **freedom of the will**
  (having one's effective first-order desires align with one's preferred
  higher-order
  volitions).[^[\[28\]]{.underline}^](#fn28)[^[\[29\]]{.underline}^](#fn29)[^[\[8\]]{.underline}^](#fn8)

The hierarchical theory of desires emphasises internal structure of the
will (first-order vs second-order desires, identification, commitment),
while taking for granted that physical and situational impediments can
block action irrespective of this structure. In your
terms:[^[\[29\]]{.underline}^](#fn29)[^[\[28\]]{.underline}^](#fn28)

- Freedom of action is limited by **input-like constraints** (bodily and
  environmental).

- Freedom of will is limited by **processing constraints** (failures of
  the evaluative system to align with the agent's reflective
  standpoint).

**Weakness of will, compulsion, and internal vs external constraint**

The SEP entry on weakness of will distinguishes:

- Cases where an agent acts against her all-things-considered judgement
  (akrasia/weakness), where the constraint is internal conflict among
  motivational states.[^[\[30\]]{.underline}^](#fn30)

- Cases of compulsion, where motivational processes are so abnormal or
  overpowering that agency is
  compromised.[^[\[31\]]{.underline}^](#fn31)

These accounts focus on **the internal organization of motivation and
evaluation**, assuming background physical and situational feasibility.
Again, this is your "processing constraint" side: nothing in the world
forbids the healthier choice, but the evaluative system outputs "don't."

**Rational choice: feasibility constraints vs preferences**

Mainstream rational choice theory in economics formalises exactly this
split:

- Choices are determined by **feasibility constraints** and by an
  internal **preference ordering**.

- A standard introduction states that rational choice is "determining
  what options are available and then choosing the most preferred one
  according to some consistent
  criterion."[^[\[10\]]{.underline}^](#fn10)

- A recent overview sums this up as choices being determined by
  **physical constraints, beliefs (or expectations), and
  preferences**.[^[\[11\]]{.underline}^](#fn11)

In that language:

- Physical constraints and institutional/market constraints define the
  **feasible set**---your input constraints. One cannot choose an option
  outside this set, regardless of how strong the preference for it is.

- Preferences (and beliefs) define the **evaluation and selection among
  feasible options**---your processing constraints.

Your "maximum motivation" test corresponds directly to the standard
conditional analysis of "could have done otherwise": had the agent
willed differently, and if the option was in the feasible set, the agent
would have acted differently. Where changing the will would not have
changed the outcome, the constraint lies outside the evaluative system.

**Comparative cognition: "unwilling" vs "unable"**

Experimental work with nonhuman primates also treats this distinction as
psychologically real. In a classic study, researchers distinguished:

- Conditions where an experimenter is **unable** to pass food (physical
  barrier or clumsiness).

- Conditions where the experimenter is **unwilling** (teasing,
  deliberate withholding).

Tonkean macaques responded differently: they waited longer and showed
more frustration in the "unwilling" condition, indicating sensitivity to
the difference between external impossibility and an agent's internal
refusal. This is a behavioural-level analogue of your "world won't allow
it" vs "evaluative system outputs 'don't'."[^[\[9\]]{.underline}^](#fn9)

**Cognitive neuroscience of "can" vs "will"**

The BG/STN work discussed earlier plays a bridging role between
philosophy and neuroscience:

- Studies using deep brain stimulation and imaging have repeatedly
  linked **STN activity** to increases in decision thresholds during
  conflict or when there are multiple alternatives, slowing responses to
  prevent impulsive
  actions.[^[\[23\]]{.underline}^](#fn23)[^[\[15\]]{.underline}^](#fn15)[^[\[22\]]{.underline}^](#fn22)[^[\[4\]]{.underline}^](#fn4)

- These models explicitly treat:

  - **Sensory and value evidence** as inputs to cortical and striatal
    accumulators (what is objectively possible and how good it is).

  - **STN/GPi-mediated threshold control** as setting the *policy* for
    when enough evidence has accumulated to act (how willing the system
    is to
    commit).[^[\[1\]]{.underline}^](#fn1)[^[\[3\]]{.underline}^](#fn3)[^[\[23\]]{.underline}^](#fn23)[^[\[4\]]{.underline}^](#fn4)

Under constant inputs, increasing thresholds corresponds to the system
internally deciding "not yet" or effectively "don't"---a processing
constraint. Under constant thresholds, removing options from the input
(e.g., via lesion, environmental change) is a pure input constraint.

**Pulling it together for your model**

Across these literatures, there is a consistent pattern:

- **Input-like constraints**

  - In COM-B: capability (physical/psychological) and opportunity
    (physical/social) acting as logic gates on
    motivation.[^[\[5\]]{.underline}^](#fn5)[^[\[6\]]{.underline}^](#fn6)[^[\[7\]]{.underline}^](#fn7)

  - In rational choice: feasibility constraints and physical constraints
    that determine the choice
    set.[^[\[10\]]{.underline}^](#fn10)[^[\[11\]]{.underline}^](#fn11)

  - In BG models: sensory, contextual, and value representations that
    determine drift/evidence and even which actions are
    representable.[^[\[17\]]{.underline}^](#fn17)[^[\[2\]]{.underline}^](#fn2)[^[\[16\]]{.underline}^](#fn16)

  - In philosophy: the "negative" component of freedom---absence of
    external impediments or compulsion.[^[\[8\]]{.underline}^](#fn8)

- **Processing/evaluative constraints**

  - In COM-B: motivation as "all those brain processes that energize and
    direct behaviour" (beliefs, values, self-efficacy, emotion,
    habit).[^[\[25\]]{.underline}^](#fn25)[^[\[5\]]{.underline}^](#fn5)[^[\[7\]]{.underline}^](#fn7)

  - In BG models: STN/GPi threshold control and Go/NoGo balance that
    implement cautious vs impulsive policies over fixed
    inputs.[^[\[15\]]{.underline}^](#fn15)[^[\[3\]]{.underline}^](#fn3)[^[\[4\]]{.underline}^](#fn4)[^[\[1\]]{.underline}^](#fn1)

  - In philosophy: structure of the will and higher-order endorsement
    (Frankfurt), weakness of will vs compulsion, and the positive
    component of freely doing what one
    wills.[^[\[28\]]{.underline}^](#fn28)[^[\[29\]]{.underline}^](#fn29)[^[\[30\]]{.underline}^](#fn30)

Your "maximal motivation" test is, in effect, a synthesis of:

- COM-B's idea that capability and opportunity are **gates on
  motivation**, not parts of motivation
  itself.[^[\[6\]]{.underline}^](#fn6)

- Rational choice's separation of **feasibility** from **preference**.

- Drift--diffusion/BG models' separation of **evidence (drift)** from
  **decision threshold/policy**, with distinct neural substrates for
  each.[^[\[3\]]{.underline}^](#fn3)[^[\[16\]]{.underline}^](#fn16)[^[\[1\]]{.underline}^](#fn1)

Framed explicitly in those terms, your A/B distinction is not only
defensible but well-supported: it brings together established
distinctions under a single behavioural test.

⁂

1.  [[https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3002978]{.underline}](https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3002978)

2.  [[https://pubmed.ncbi.nlm.nih.gov/15701239/]{.underline}](https://pubmed.ncbi.nlm.nih.gov/15701239/)

3.  [[https://www.biorxiv.org/content/10.1101/2024.09.12.612658v1.full-text]{.underline}](https://www.biorxiv.org/content/10.1101/2024.09.12.612658v1.full-text)

4.  [[https://www.mrcbndu.ox.ac.uk/sites/default/files/pdf_files/Zenon
    et al Brain 2016
    Epub.pdf]{.underline}](https://www.mrcbndu.ox.ac.uk/sites/default/files/pdf_files/Zenon%20et%20al%20Brain%202016%20Epub.pdf)

5.  [[https://pmc.ncbi.nlm.nih.gov/articles/PMC3096582/]{.underline}](https://pmc.ncbi.nlm.nih.gov/articles/PMC3096582/)

6.  [[https://prevention-collaborative.org/wp-content/uploads/2021/08/West_2020_Introduction_Com-B-and-Prime.pdf]{.underline}](https://prevention-collaborative.org/wp-content/uploads/2021/08/West_2020_Introduction_Com-B-and-Prime.pdf)

7.  [[https://www.habitweekly.com/models-frameworks/the-com-b-model]{.underline}](https://www.habitweekly.com/models-frameworks/the-com-b-model)

8.  [[https://plato.stanford.edu/entries/compatibilism/]{.underline}](https://plato.stanford.edu/entries/compatibilism/)

9.  [[https://pmc.ncbi.nlm.nih.gov/articles/PMC5419206/]{.underline}](https://pmc.ncbi.nlm.nih.gov/articles/PMC5419206/)

10. [[https://web.stanford.edu/\~jdlevin/Econ 202/Choice
    Theory.pdf]{.underline}](https://web.stanford.edu/~jdlevin/Econ%20202/Choice%20Theory.pdf)

11. [[https://www.cambridge.org/core/books/inexact-and-separate-science-of-economics/rationality-preferences-and-utility-theory/52E124E92561EB31FE83690DC6390080]{.underline}](https://www.cambridge.org/core/books/inexact-and-separate-science-of-economics/rationality-preferences-and-utility-theory/52E124E92561EB31FE83690DC6390080)

12. [[http://www.scholarpedia.org/article/Models_of_dopaminergic_modulation]{.underline}](http://www.scholarpedia.org/article/Models_of_dopaminergic_modulation)

13. [[https://www.cmu.edu/dietrich/psychology/cognitiveaxon/documents/Rubin_etal_2020.pdf]{.underline}](https://www.cmu.edu/dietrich/psychology/cognitiveaxon/documents/Rubin_etal_2020.pdf)

14. [[https://med.libretexts.org/Bookshelves/Pharmacology_and_Neuroscience/Computational_Cognitive_Neuroscience_3e\_(O\'Reilly_and_Munakata)/07:\_Motor_Control_and_Reinforcement_Learning/7.02:\_Basal_Ganglia_Action_Selection_and_Reinforcement_Learning]{.underline}](https://med.libretexts.org/Bookshelves/Pharmacology_and_Neuroscience/Computational_Cognitive_Neuroscience_3e_(O'Reilly_and_Munakata)/07:_Motor_Control_and_Reinforcement_Learning/7.02:_Basal_Ganglia_Action_Selection_and_Reinforcement_Learning)

15. [[https://ski.clps.brown.edu/papers/Frank_STN.preprint.pdf]{.underline}](https://ski.clps.brown.edu/papers/Frank_STN.preprint.pdf)

16. [[https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2012.00183/full]{.underline}](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2012.00183/full)

17. [[https://elifesciences.org/articles/08723]{.underline}](https://elifesciences.org/articles/08723)

18. [[https://pmc.ncbi.nlm.nih.gov/articles/PMC4686424/]{.underline}](https://pmc.ncbi.nlm.nih.gov/articles/PMC4686424/)

19. [[https://ski.clps.brown.edu/papers/GingJehli_PLOSBio.pdf]{.underline}](https://ski.clps.brown.edu/papers/GingJehli_PLOSBio.pdf)

20. [[https://pmc.ncbi.nlm.nih.gov/articles/PMC11756759/]{.underline}](https://pmc.ncbi.nlm.nih.gov/articles/PMC11756759/)

21. [[https://2024.ccneuro.org/pdf/116_Paper_authored_CCN_CD01_Abstract.pdf]{.underline}](https://2024.ccneuro.org/pdf/116_Paper_authored_CCN_CD01_Abstract.pdf)

22. [[https://www.nature.com/articles/s41467-022-35121-8]{.underline}](https://www.nature.com/articles/s41467-022-35121-8)

23. [[https://pmc.ncbi.nlm.nih.gov/articles/PMC4896390/]{.underline}](https://pmc.ncbi.nlm.nih.gov/articles/PMC4896390/)

24. [[https://social-change.co.uk/files/02.09.19_COM-B_and_changing_behaviour\_.pdf]{.underline}](https://social-change.co.uk/files/02.09.19_COM-B_and_changing_behaviour_.pdf)

25. [[https://pmc.ncbi.nlm.nih.gov/articles/PMC8094434/]{.underline}](https://pmc.ncbi.nlm.nih.gov/articles/PMC8094434/)

26. [[https://togetheragency.co.uk/news/the-com-b-model-of-behaviour-change-explained]{.underline}](https://togetheragency.co.uk/news/the-com-b-model-of-behaviour-change-explained)

27. [[https://ui-patterns.com/blog/designing-for-change-using-the-com-b-model-to-drive-behavior-change]{.underline}](https://ui-patterns.com/blog/designing-for-change-using-the-com-b-model-to-drive-behavior-change)

28. [[https://www.etd.ceu.edu/2012/fphwaz01.pdf]{.underline}](https://www.etd.ceu.edu/2012/fphwaz01.pdf)

29. [[http://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0011-15032016000100035]{.underline}](http://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0011-15032016000100035)

30. [[https://plato.stanford.edu/archives/fall2013/entries/weakness-will/]{.underline}](https://plato.stanford.edu/archives/fall2013/entries/weakness-will/)

31. [[https://philarchive.org/archive/GORWIT]{.underline}](https://philarchive.org/archive/GORWIT)

32. [[https://www.repository.cam.ac.uk/bitstreams/354412fe-5aad-4258-a67a-4eae5ade20d1/download]{.underline}](https://www.repository.cam.ac.uk/bitstreams/354412fe-5aad-4258-a67a-4eae5ade20d1/download)

33. [[https://philarchive.org/archive/MAKIIA]{.underline}](https://philarchive.org/archive/MAKIIA)

34. [[https://www.reddit.com/r/philosophy/comments/27oiw1/weekly_discussion_frankfurts_account_of_freedom/]{.underline}](https://www.reddit.com/r/philosophy/comments/27oiw1/weekly_discussion_frankfurts_account_of_freedom/)

35. [[http://www.mapageweb.umontreal.ca/laurier/textes/phi-6330-h12/Bratman-Intention-Belief-Instrumental-Rationality-09.pdf]{.underline}](http://www.mapageweb.umontreal.ca/laurier/textes/phi-6330-h12/Bratman-Intention-Belief-Instrumental-Rationality-09.pdf)

36. [[https://iep.utm.edu/humemora/]{.underline}](https://iep.utm.edu/humemora/)

37. [[https://www.emse.fr/\~boissier/enseignement/defiia/up5/pdf/Bratman-PlansPracticalResoning.pdf]{.underline}](https://www.emse.fr/~boissier/enseignement/defiia/up5/pdf/Bratman-PlansPracticalResoning.pdf)

38. [[https://pmc.ncbi.nlm.nih.gov/articles/PMC11638286/]{.underline}](https://pmc.ncbi.nlm.nih.gov/articles/PMC11638286/)

39. [[https://ndpr.nd.edu/reviews/shared-and-institutional-agencytoward-a-planning-theory-of-human-practical-organization/]{.underline}](https://ndpr.nd.edu/reviews/shared-and-institutional-agencytoward-a-planning-theory-of-human-practical-organization/)

40. [[https://www.jstor.org/stable/2024717]{.underline}](https://www.jstor.org/stable/2024717)

41. [[https://philarchive.org/archive/CYRCAL]{.underline}](https://philarchive.org/archive/CYRCAL)

42. [[https://plato.stanford.edu/archives/fall2014/entries/intention/]{.underline}](https://plato.stanford.edu/archives/fall2014/entries/intention/)

43. [[https://brainhealth.rutgers.edu/wp-content/uploads/2022/04/Moustafa_Gluck_prefrontal-basal_ganglia_model_of_Parkinsons_disease_2011.pdf]{.underline}](https://brainhealth.rutgers.edu/wp-content/uploads/2022/04/Moustafa_Gluck_prefrontal-basal_ganglia_model_of_Parkinsons_disease_2011.pdf)

44. [[https://pubmed.ncbi.nlm.nih.gov/39847590/]{.underline}](https://pubmed.ncbi.nlm.nih.gov/39847590/)

45. [[https://en.wikipedia.org/wiki/Cortico-basal_ganglia-thalamo-cortical_loop]{.underline}](https://en.wikipedia.org/wiki/Cortico-basal_ganglia-thalamo-cortical_loop)

46. [[https://dl.acm.org/doi/abs/10.1162/0898929052880093]{.underline}](https://dl.acm.org/doi/abs/10.1162/0898929052880093)

47. [[https://www.gingjehli.com/publications]{.underline}](https://www.gingjehli.com/publications)

48. [[https://www.cmu.edu/dietrich/psychology/cognitiveaxon/documents/Dunovan_etal_2015.pdf]{.underline}](https://www.cmu.edu/dietrich/psychology/cognitiveaxon/documents/Dunovan_etal_2015.pdf)

49. [[https://modeldb.science/showmodel?model=79488]{.underline}](https://modeldb.science/showmodel?model=79488)

50. [[https://www.biorxiv.org/content/10.1101/2025.10.30.685574v1.full-text]{.underline}](https://www.biorxiv.org/content/10.1101/2025.10.30.685574v1.full-text)

51. [[https://sweetinstitute.com/the-com-b-model-and-behavior-change/]{.underline}](https://sweetinstitute.com/the-com-b-model-and-behavior-change/)

52. [[https://thedecisionlab.com/reference-guide/organizational-behavior/the-com-b-model-for-behavior-change]{.underline}](https://thedecisionlab.com/reference-guide/organizational-behavior/the-com-b-model-for-behavior-change)

53. [[https://www.dunnhumby.com/resources/blog/ai-science-data/en/the-behaviour-change-wheel-using-psychology-to-encourage-healthier-and-more-sustainable-choices/]{.underline}](https://www.dunnhumby.com/resources/blog/ai-science-data/en/the-behaviour-change-wheel-using-psychology-to-encourage-healthier-and-more-sustainable-choices/)

54. [[https://paloaltou.edu/resources/business-of-practice-blog/behavior-change-wheel]{.underline}](https://paloaltou.edu/resources/business-of-practice-blog/behavior-change-wheel)

55. [[https://thewellnesssociety.org/the-com-b-model-a-helpful-guide-for-coaches/]{.underline}](https://thewellnesssociety.org/the-com-b-model-a-helpful-guide-for-coaches/)

56. [[https://www.sciencedirect.com/org/science/article/pii/S096999882500013X]{.underline}](https://www.sciencedirect.com/org/science/article/pii/S096999882500013X)

57. [[https://people-shift.com/articles/the-behavior-change-wheel/]{.underline}](https://people-shift.com/articles/the-behavior-change-wheel/)

58. [[https://www.qeios.com/read/WW04E6.2]{.underline}](https://www.qeios.com/read/WW04E6.2)

59. [[https://swellandcut.com/mag-archive/]{.underline}](https://swellandcut.com/mag-archive/)

60. [[https://www.scribd.com/document/891214676/Sinhababu-Neil-Humean-nature]{.underline}](https://www.scribd.com/document/891214676/Sinhababu-Neil-Humean-nature)

61. [[https://coelsblog.wordpress.com/2017/11/10/another-philosopher-of-science-doesnt-understand-science/]{.underline}](https://coelsblog.wordpress.com/2017/11/10/another-philosopher-of-science-doesnt-understand-science/)

62. [[https://www.linkedin.com/posts/aaron-khoo-8807812_workstress-invisibleload-techleadership-activity-7415075671846334472-4aY9]{.underline}](https://www.linkedin.com/posts/aaron-khoo-8807812_workstress-invisibleload-techleadership-activity-7415075671846334472-4aY9)

63. [[https://www.sciencedirect.com/science/article/pii/S0896627308008362]{.underline}](https://www.sciencedirect.com/science/article/pii/S0896627308008362)

64. [[https://www.reddit.com/r/Parahumans/comments/inz6mi/pho_sundays_yellow_though_the_fans_win/]{.underline}](https://www.reddit.com/r/Parahumans/comments/inz6mi/pho_sundays_yellow_though_the_fans_win/)

65. [[https://www.sciencedirect.com/science/article/abs/pii/S0304406897000426]{.underline}](https://www.sciencedirect.com/science/article/abs/pii/S0304406897000426)

66. [[https://mitpress.ublish.com/book/rational-choice]{.underline}](https://mitpress.ublish.com/book/rational-choice)

67. [[http://www.geoffroydeclippel.net/Publications
    PDFs/good-enough.pdf]{.underline}](http://www.geoffroydeclippel.net/Publications%20PDFs/good-enough.pdf)

68. [[https://economics.brown.edu/sites/default/files/papers/2018-12.pdf]{.underline}](https://economics.brown.edu/sites/default/files/papers/2018-12.pdf)

69. [[https://business.baylor.edu/steve_green/green1.doc]{.underline}](https://business.baylor.edu/steve_green/green1.doc)

70. [[http://zhangjun.weebly.com/uploads/2/8/1/8/2818435/microistudent.pdf]{.underline}](http://zhangjun.weebly.com/uploads/2/8/1/8/2818435/microistudent.pdf)

71. [[https://cridaq.uqam.ca/IMG/pdf/Abizadeh\_-]{.underline}](https://cridaq.uqam.ca/IMG/pdf/Abizadeh_-)*Philosophy*-\_Rhetoric.pdf

72. [[https://oiccpress.com/ijps/article/download/7512/4172]{.underline}](https://oiccpress.com/ijps/article/download/7512/4172)

73. [[https://montoya.econ.ubc.ca/book/preference_theory/preference_theory_304.pdf]{.underline}](https://montoya.econ.ubc.ca/book/preference_theory/preference_theory_304.pdf)

74. [[https://plato.stanford.edu/archives/fall2020/entries/civil-disobedience/]{.underline}](https://plato.stanford.edu/archives/fall2020/entries/civil-disobedience/)
