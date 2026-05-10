# Breast Cancer Recurrence Classification

A machine learning pipeline for predicting breast cancer recurrence using the Wisconsin Prognostic Breast Cancer (WPBC) dataset. Six classifiers are compared with a full preprocessing pipeline including SMOTE oversampling, StandardScaler normalization, and ANOVA-based feature selection.

## Dataset

**Wisconsin Prognostic Breast Cancer (WPBC)**  
Source: [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic)  
Donor: Dr. William H. Wolberg, University of Wisconsin (December 1995)

| Property | Value |
|---|---|
| Samples | 198 patients |
| Features | 32 numeric (cell nucleus measurements) + 2 clinical |
| Target | Binary — Recurrence (R, 23.7%) / Non-Recurrence (N, 76.3%) |
| Missing values | 4 (`lymph_node_status`, ~2%) |

Features are computed from fine needle aspirate (FNA) digital images and describe characteristics of cell nuclei. For each of 10 base measurements (radius, texture, perimeter, area, smoothness, compactness, concavity, concave points, symmetry, fractal dimension) the dataset provides:
- **Mean** across all nuclei in the image
- **Standard error** (SE)
- **Worst** (mean of the three largest values)

Two additional clinical features: `tumor_size` and `lymph_node_status`.

## Project Structure

```
breast-cancer-recurrence-classification/
├── data/
│   ├── wpbc.data          # Raw dataset (no header row, ? = missing)
│   └── wpbc.names         # Feature descriptions from UCI
├── breast-cancer-recurrence-classification.ipynb
└── README.md
```

## Methodology

### Preprocessing Pipeline
1. **Missing value imputation** — `lymph_node_status` (4 values) filled with column median
2. **Data leakage prevention** — `time` column removed (follow-up duration correlates −0.35 with outcome; class-conditional statistics confirm leakage)
3. **Stratified train/test split** — 80/20, `random_state=42`
4. **StandardScaler** — fit on training set only, then applied to test set
5. **SMOTE** — applied to training set only (158 → 240 samples, 1:1 class ratio); test set remains at original distribution

### Feature Selection
ANOVA F-test (`SelectKBest`) applied after SMOTE. Top 15 statistically significant features (p < 0.05) selected from 32 total, reducing dimensionality and multicollinearity.

Top features by F-score: `area_worst`, `radius_worst`, `perimeter_worst`, `concave_points_worst`, `tumor_size`, `lymph_node_status`.

### Models Compared

| Model | Notes |
|---|---|
| Logistic Regression | L1/L2 regularization, liblinear/saga solvers |
| K-Nearest Neighbors | Default k=5; tuned with distance weighting |
| Decision Tree | max_depth=5 baseline |
| Random Forest | 200 estimators baseline |
| Gradient Boosting | 200 estimators, lr=0.1 baseline |
| SVM | RBF kernel, probability calibration |

All models evaluated with 5-fold stratified cross-validation (F1 scoring), then tested on the held-out test set. GridSearchCV applied for hyperparameter tuning (804 combinations total).

## Results Summary

### Baseline Performance (Test Set)

| Model | CV F1 | Test Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|---|
| **KNN** | 0.598 | 0.600 | 0.333 | **0.778** | **0.467** |
| Logistic Regression | 0.598 | 0.725 | 0.500 | 0.333 | 0.400 |
| SVM | 0.572 | **0.750** | **0.600** | 0.333 | 0.429 |
| Gradient Boosting | 0.529 | 0.625 | 0.286 | 0.444 | 0.348 |
| Decision Tree | 0.505 | 0.575 | 0.231 | 0.333 | 0.273 |
| Random Forest | 0.488 | 0.625 | 0.200 | 0.111 | 0.143 |

### AUC (ROC)

| Model | AUC |
|---|---|
| **Logistic Regression** | **0.749** |
| KNN | 0.676 |
| SVM | 0.667 |
| Gradient Boosting | 0.563 |
| Random Forest | 0.552 |
| Decision Tree | 0.480 |

### Overfitting Analysis

| Model | Train F1 | Test F1 | Gap | Status |
|---|---|---|---|---|
| Random Forest | 1.000 | 0.118 | 0.882 | Severe |
| Gradient Boosting | 1.000 | 0.235 | 0.765 | Severe |
| Decision Tree | 0.890 | 0.320 | 0.570 | Severe |
| SVM | 0.740 | 0.375 | 0.365 | Severe |
| KNN | 0.816 | 0.467 | 0.350 | Severe |
| **Logistic Regression** | **0.639** | **0.381** | **0.258** | Moderate |

### Feature Importance (Random Forest — Gini)

| Rank | Feature | Importance |
|---|---|---|
| 1 | `lymph_node_status` | 0.140 |
| 2 | `tumor_size` | 0.120 |
| 3 | `texture_se` | 0.084 |
| 4 | `area_worst` | 0.080 |
| 5 | `concave_points_worst` | 0.068 |

## Key Findings

- **KNN achieves the highest test F1 (0.467)** and best recall for the recurrence class (0.778 — detects 7 of 9 true recurrence cases). In a clinical context, recall is the primary metric: missing a true recurrence (false negative) is far more harmful than false alarms.
- **Logistic Regression achieves the best AUC (0.749)** and lowest overfitting gap, demonstrating greater generalization stability on this small dataset.
- **Tree-based ensembles (Random Forest, Gradient Boosting) severely overfit**: perfect training F1 collapses to 0.118–0.235 on the test set — a consequence of their high variance on only 198 samples.
- **GridSearchCV did not reliably improve test performance**, confirming that the generalization challenge is structural (small N=40 test set, class imbalance) rather than a hyperparameter issue.
- **Lymph node status and tumor size** are the two most informative features, consistent with established clinical prognostic knowledge.

## Limitations

- 198 total samples is small for reliable generalization; a 40-sample test set means a single prediction flip changes metrics by ~2.5%.
- SMOTE introduces synthetic samples that may not reflect real data distributions.
- Nested cross-validation would give more stable performance estimates than a single stratified split.

## Environment Setup

```bash
conda create -n recurrence-ml python=3.12
conda activate recurrence-ml
pip install pandas numpy matplotlib seaborn scikit-learn imbalanced-learn jupyter
```

## References

- Wolberg, W. H., Street, W. N., & Mangasarian, O. L. (1995). *Machine learning techniques to diagnose breast cancer from image-processed nuclear features of fine needle aspirates*. Cancer Letters, 77, 163–171.
- UCI Machine Learning Repository. (1995). *Breast Cancer Wisconsin (Prognostic) Data Set*. https://archive.ics.uci.edu/dataset/16/breast+cancer+wisconsin+prognostic
- Chawla, N. V., Bowyer, K. W., Hall, L. O., & Kegelmeyer, W. P. (2002). SMOTE: Synthetic Minority Over-sampling Technique. *Journal of Artificial Intelligence Research*, 16, 321–357.
- Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *JMLR*, 12, 2825–2830.
