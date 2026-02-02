# Testing LLM-Integrated Software

Software teams are racing to integrate LLMs into much of today's software, and this impacts how teams will work. I have been thinking deeply about this recently and here are some of my ideas.

Unlike traditional software, systems that integrate with LLMs are non-deterministic; the same input can produce different results, increasing the challenge of testing. High-performing software teams have used automated testing to ensure fast feedback cycles, scalability, and risk mitigation.

If we want to achieve the same level of test automation with LLM systems, we need to:

- Define what quality means with a series of metrics (relevance, clarity, hallucinations, etc.)
- Measure quality with the right scoring mechanisms for each metric (AI-based evaluators)
- Integrate into development workflows, such as CI/CD pipelines
- Validate that the metrics and scoring we choose are producing the correct outcomes in production

In order to gain confidence in evaluation mechanisms, teams will need to adopt the same iterative approach to improve those mechanisms as in product development itself.

## What Software Teams Need to Embrace

1. **Learning and Improvement** - To better evaluate LLM-integrated software over time.
2. **Empowerment** - To course correct quickly and drive towards optimal evaluation.
3. **Problem-Aligned Teams** - To understand what quality means in the context of the problem.
4. **Cross-functional Engagement** - To broaden perspective on valuable metrics.
