# Git Version Control Directive

The use of Git is strict and mandatory throughout the entire development lifecycle of this project. The fundamental goal is to build a granular, organized, and reproducible history that allows auditing changes step by step and performing surgical rollbacks if necessary.

## Execution Rules

1. **High Granularity and Frequency:**
   - Segment the implementation into its minimal logical components.
   - Do not group multiple responsibilities into a single commit.
   - The number of commits must be substantial, reflecting each micro-stage completed in an atomic manner.

2. **Logical and Progressive Order:**
   - Create commits following the natural flow of construction:
     1. Configuration / base models / types
     2. Logic / services / utilities
     3. UI components / page consumption
     4. Adjustments, refinements, or validations

3. **Message Format:**
   - Write commit messages in the imperative/infinitive form in Spanish.
   - Clear and concise, describing the exact action performed in that unit of code (e.g., `git commit -m "definir los colores globales del sistema de diseño"`).

4. **Restricted Action:**
   - Exclusively execute `git add` and `git commit` commands.
   - **Under no circumstances execute remote push commands (`git push`)**; that action is strictly reserved for the developer.
