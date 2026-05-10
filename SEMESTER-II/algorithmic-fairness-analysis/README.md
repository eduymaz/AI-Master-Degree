# Algorithmic Fairness Analysis — COMPAS Recidivism Dataset

An analysis of algorithmic bias and fairness using the COMPAS recidivism scoring dataset. The study covers statistical evaluation of risk scores, demographic disparities, and the ethical and legal dimensions of predictive decision-making systems.

## Environment Setup

Install Anaconda and set up the required environment:

1. Download and install **Anaconda** from [https://www.anaconda.com/](https://www.anaconda.com/)
2. Create a new environment and install dependencies:

```bash
conda create -n fairness-analysis python=3.10 -y
conda activate fairness-analysis
cd algorithmic-fairness-analysis
pip install -r requirements.txt
```

## Project Files

- **`algorithmic-fairness-analysis.ipynb`** — Main notebook: data exploration, fairness metrics, visualizations, and discussion.
- **`compas-scores-two-years.csv`** — COMPAS recidivism dataset (two-year follow-up, Broward County, FL).
- **`requirements.txt`** — Required Python packages.

## Running the Notebook

```bash
conda activate fairness-analysis
cd algorithmic-fairness-analysis
jupyter notebook algorithmic-fairness-analysis.ipynb
```

## Analysis Scope

The notebook is organized into the following sections:

1. Dataset loading and initial exploration
2. Applying the `|days_b_screening_arrest| <= 30` filter (ProPublica methodology)
3. Descriptive statistics across key demographic and outcome variables
4. COMPAS score distribution — full dataset and by race
5. Binary risk classification (`1–4 = low risk`, `5–10 = high risk`)
6. Fairness metrics: High-Risk Rate, False Positive Rate (FPR), Positive Predictive Value (PPV)
7. Comparative bar charts across racial groups
8. Discussion: impossibility theorem, structural bias, governance recommendations

## References

- Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016). *Machine Bias*. ProPublica.
- Chouldechova, A. (2017). Fair prediction with disparate impact. *Big Data*, 5(2), 153–163.
- Kleinberg, J., Mullainathan, S., & Raghavan, M. (2016). *Inherent trade-offs in the fair determination of risk scores*. arXiv:1609.05807.
