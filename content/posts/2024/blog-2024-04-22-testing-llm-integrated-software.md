# Testing LLM-Integrated Software

Software teams are racing to integrate LLMs into much of today's software, and this impacts how teams will work. I have been thinking deeply about this recently and here are some of my ideas.

Unlike traditional software, systems that integrate with LLMs are non-deterministic; the same input can produce different results, increasing the challenge of testing. High-performing software teams have used automated testing to ensure fast feedback cycles, scalability, and risk mitigation.

If we want to achieve the same level of test automation with LLM systems, we need to:

- Define what quality means with a series of metrics (relevance, clarity, hallucinations, etc.)
- Measure quality with the right scoring mechanisms for each metric (AI-based evaluators)
- Integrate into development workflows, such as CI/CD pipelines
- Validate that the metrics and scoring we choose are producing the correct outcomes in production

In order to gain confidence in evaluation mechanisms, teams will need to adopt the same iterative approach to improve those mechanisms as in product development itself.

## The Determinism Challenge

Traditional software is deterministic: the same input always produces the same output. Testing is straightforward — compare the actual output to the expected output and get a yes or no answer.

LLMs are non-deterministic. The same input can produce different outputs. This means we can't simply compare outputs to a single expected result. We need a different approach — one where we evaluate probable quality rather than exact correctness.

## Defining Quality with Metrics

Quality for LLM-based systems must be defined through a series of measurable metrics. Examples include:

- **Summarization**: The ability of a model to condense text while retaining key information.
- **Relevance**: The extent to which model outputs are pertinent to the given prompt or task.
- **Clarity**: The ease with which model outputs can be understood, without ambiguity or confusion.
- **Hallucination**: When a model generates incorrect or non-existent information.

For RAG (Retrieval-Augmented Generation) systems specifically, additional metrics apply:

- **Faithfulness**: Whether the system's output factually aligns with the information in the retrieved context.
- **Answer Relevancy**: How concise the output is (relevant sentences vs. total sentences).
- **Contextual Precision**: Whether the retrieved text is appropriately relevant.
- **Contextual Recall**: How well the retrieved output aligns with the expected output.
- **Contextual Relevance**: The proportion of sentences in the retrieval context that are relevant to the input.

A good metric should be quantitative (represented as a numerical value for clear comparison), reliable (consistent results for the same tasks), and accurate (reflective of real-world performance and human judgment).

## Measuring Quality with Scorers

A scorer generates a numerical value for a given metric. There are several approaches:

### Human Review

The most intuitive approach: have people review outputs and record scores. However, human review can't be automated, is slow for developer workflows, and is costly. We will need human validation, but we don't want to rely on it for every change.

### Statistical Scorers

Borrowed from Natural Language Processing, statistical scorers compare generated text against reference text using variations of counting and comparing consecutive words (n-grams):

- **BLEU** (BiLingual Evaluation Understudy): Measures translation accuracy, consistency, and grammatical correctness.
- **ROUGE** (Recall-Oriented Understudy for Gisting Evaluation): Evaluates summary quality.
- **METEOR** (Metric for Evaluation of Translation with Explicit Ordering): Assesses translation fluency, leveraging external linguistic databases like WordNet to account for synonyms.
- **Levenshtein Distance**: Measures text similarity by counting the minimum edits required to convert one text to another.

The limitation of statistical scorers is that they don't necessarily compare meaning. A response with different wording but the same meaning may score lower than a response with matching words but different meaning.

### Model-Based Scorers

Models known to function well can be used to test other models. There are two categories: LLM-based and non-LLM-based scorers.

**G-Eval (Generative Evaluation)** uses an LLM to evaluate outputs through a chain-of-thought process: introduce an evaluation task, generate evaluation steps, merge steps with the output being assessed, and produce a score. G-Eval correlates much more with human judgment than statistical methods, but can be unreliable since it relies on an LLM to produce scores, and results can change if the evaluating model is updated.

**SelfCheckGPT** is specifically designed for hallucination scoring. It assumes that hallucinated outputs are low frequency — if an LLM has knowledge of a concept, responses are likely to contain consistent facts and not contradict each other. It's a reference-less process, meaning no expected output is needed.

**QAG (Question Answer Generation)** uses yes/no answers to close-ended questions. Questions can be generated by an LLM, and a final metric score is calculated from the proportion of yes answers (e.g., 4 yes out of 5 questions = 0.8). QAG is reliable because it doesn't use LLMs to directly generate scores — only to generate and answer questions.

## Integrating into Development Workflows

Several tools and frameworks exist to integrate LLM evaluation into development pipelines:

- **DeepEval**: A comprehensive evaluation framework for LLM applications.
- **RAGAS**: RAG-specific evaluation tooling.
- **LangChain Eval**: Evaluation capabilities built into the LangChain ecosystem.
- **Prometheus**: A model fine-tuned specifically for evaluation tasks.

## Key Takeaways

- Using LLMs is a critical part of testing LLMs.
- We evaluate probable quality, not exact correctness.
- Defining test cases, selecting scorers, and choosing metrics will be an ongoing problem for human software teams to solve.

## What Software Teams Need to Embrace

1. **Learning and Improvement** - To better evaluate LLM-integrated software over time.
2. **Empowerment** - To course correct quickly and drive towards optimal evaluation.
3. **Problem-Aligned Teams** - To understand what quality means in the context of the problem.
4. **Cross-functional Engagement** - To broaden perspective on valuable metrics.

---

This post is based on a talk I gave in [Latent Space](https://docs.google.com/presentation/d/14EE2j6ii4PEA0Y-wUg80weC3eJ-qx2q41uUAEqytG28) in April 2024.
