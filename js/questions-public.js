const EXAM_QUESTIONS = [
  {
    id: 1,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "medium",
    multiSelect: false,
    question: "A food-delivery owner asks: \\\"What does a typical customer order look like?\\\" You compute mean order value = $84 and median = $58. The histogram has a long right tail (a few very large catering orders). Which answer is most honest and useful?",
    options: [
      "Report the mean ($84) because it uses all the data",
      "Report the median ($58) because it reflects a typical order without being pulled up by rare large orders",
      "Report the mode only, since the distribution is skewed",
      "Report the range, since spread matters more than center"
    ],
  },
  {
    id: 2,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "hard",
    multiSelect: false,
    question: "A marketing director shows you a scatter plot: monthly ad spend (x) vs revenue (y) with correlation r = 0.93. They conclude: \\\"Cutting ad spend in half will roughly halve our revenue.\\\" As a data analyst, your best response is:",
    options: [
      "Agree — correlation 0.93 proves a direct causal link",
      "Disagree — strong correlation does not prove causation; revenue may drive ad budgets, or both may be driven by seasonality",
      "Disagree — correlation must be negative for spending cuts to make sense",
      "Agree — with r above 0.9, the relationship is always linear and causal"
    ],
  },
  {
    id: 3,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "medium",
    multiSelect: true,
    question: "An HR manager wants to compare salary \\\"fairness\\\" across two departments. Department A: salaries tightly clustered around $55k (low spread). Department B: same average but salaries range from $35k to $90k (high spread). Which statements reflect correct statistical reasoning? (Select all that apply)",
    options: [
      "Equal means do not guarantee equal distributions or similar employee experiences",
      "Standard deviation helps quantify how much individual salaries deviate from the department mean",
      "If means are equal, the departments are identical for policy decisions",
      "Variance captures spread; a higher variance in B means more salary inequality within that department"
    ],
  },
  {
    id: 4,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "hard",
    multiSelect: false,
    question: "A warehouse logs package delivery times (days). Q1 = 2, Q3 = 5. Using the IQR outlier rule, values above Q3 + 1.5×IQR are flagged. One route shows delivery times: 2, 3, 3, 4, 4, 5, 11. The owner asks whether 11 is a data error. What is the best analyst conclusion?",
    options: [
      "Yes — delete 11 immediately; any value above Q3 is an error",
      "11 exceeds the upper bound (9.5), so it is a statistical outlier — investigate the route before deleting",
      "11 is not an outlier because it is only 6 days above the median",
      "Outlier rules are irrelevant; only the mean matters for logistics planning"
    ],
  },
  {
    id: 5,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "medium",
    multiSelect: false,
    question: "A café owner studies daily revenue vs number of rainy days per month and finds covariance Cov(rain_days, revenue) = −4,200. Monthly revenue has variance Var(revenue) = 25,000. For the linear model ŷ = β₀ + β₁·(rain_days), where ŷ is predicted monthly revenue, what is β₁ (the slope)?",
    options: [
      "−0.168",
      "−6.0",
      "0.168",
      "6.0"
    ],
  },
  {
    id: 6,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "hard",
    multiSelect: true,
    question: "A retail owner compares two stores using boxplots of daily foot traffic. Store X's box is narrow and centered high; Store Y's box is wide with a long lower whisker. Which conclusions are statistically justified? (Select all that apply)",
    options: [
      "Store X has more consistent (less variable) daily traffic than Store Y",
      "Store Y likely has more days with unusually low traffic compared to its typical range",
      "Store X always makes more revenue than Store Y",
      "Comparing box positions helps compare medians and typical ranges between stores"
    ],
  },
  {
    id: 7,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "medium",
    multiSelect: false,
    question: "A shop owner asks: \\\"Which city generated the most total revenue last quarter?\\\" You have a CSV with columns: order_id, city, revenue, order_date (stored as text \\\"2024-03-15\\\"). What is the most appropriate first step in your analysis pipeline?",
    options: [
      "Immediately run df.groupby('city')['revenue'].sum()",
      "Inspect dtypes, parse order_date to datetime, filter to last quarter, then aggregate by city",
      "Take df['revenue'].max() and report that city",
      "Drop all rows with missing city values without checking how many or why"
    ],
  },
  {
    id: 8,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "hard",
    multiSelect: false,
    question: "You load a customer dataset for churn analysis. df.isna().sum() shows customer_age is missing for 38% of rows. The junior analyst runs df.dropna() and builds the report. What is the main problem?",
    options: [
      "dropna() is never valid in pandas",
      "You may lose nearly 40% of customers and introduce bias if missingness is not random (e.g., older customers less likely to share age)",
      "Missing values only affect visualization, not statistics",
      "fillna(0) for age would always be the better choice"
    ],
  },
  {
    id: 9,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "hard",
    multiSelect: false,
    question: "An e-commerce owner asks: \\\"What is the average order value (AOV) per region for active customers only?\\\" Each row is one line item (multiple rows per order_id). Which logic best matches the business question?",
    options: [
      "df[df['status']=='active'].groupby('region')['price'].mean()",
      "Filter active customers → compute total revenue per order_id → then average order totals by region",
      "df.groupby('region')['order_id'].count()",
      "df['price'].sum() / df['order_id'].nunique() globally, repeated per region manually"
    ],
  },
  {
    id: 10,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "medium",
    multiSelect: true,
    question: "During EDA on sales data, you find 120 duplicate order_id rows (exact copies). The owner asks whether revenue totals are trustworthy. Which actions reflect sound data-analysis thinking? (Select all that apply)",
    options: [
      "Investigate whether duplicates are system errors, re-exports, or legitimate re-postings before deciding",
      "Check df.duplicated().sum() and examine a sample of duplicated rows",
      "Always drop duplicates silently so dashboards look cleaner",
      "After understanding the cause, deduplicate if appropriate and document the impact on reported revenue"
    ],
  },
  {
    id: 11,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "medium",
    multiSelect: false,
    question: "The CEO asks: \\\"Why did March sales drop 15% compared to February?\\\" You have daily sales, marketing spend, product returns, and a holiday calendar. What should you do FIRST?",
    options: [
      "Build a linear regression model immediately",
      "Form hypotheses, slice March vs February by dimensions (product, channel, region), and look for compositional changes before claiming a single cause",
      "Report the 15% drop and stop — the question is already answered",
      "Remove all outliers from March so the drop disappears"
    ],
  },
  {
    id: 12,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "hard",
    multiSelect: false,
    question: "A pandas chain returns the top 3 salespeople by total revenue:\\n\\ndf.groupby('salesperson')['revenue'].sum().sort_values(ascending=False).head(3)\\n\\nThe owner then asks for the same ranking but excluding refunded orders (refund_flag == 1). Which modification preserves correct business logic?",
    options: [
      "df.groupby('salesperson')['revenue'].sum().head(3) — refunds are small so ignore them",
      "df[df['refund_flag']==0].groupby('salesperson')['revenue'].sum().sort_values(ascending=False).head(3)",
      "df.sort_values('revenue').groupby('salesperson').sum().head(3)",
      "df.drop('refund_flag').groupby('salesperson')['revenue'].mean().head(3)"
    ],
  },
  {
    id: 13,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "medium",
    multiSelect: false,
    question: "A digital marketer reports: P(customer clicks ad) = 0.04 and P(customer purchases | clicked ad) = 0.10. What is P(click AND purchase)?",
    options: [
      "0.14",
      "0.004",
      "0.40",
      "0.06"
    ],
  },
  {
    id: 14,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "hard",
    multiSelect: false,
    question: "A fraud-detection rule flags 2% of transactions. Historically, 0.3% of all transactions are actually fraudulent. When the rule fires, only 25% of flagged transactions turn out to be fraud. A manager says: \\\"The rule is wrong 75% of the time, so scrap it.\\\" What is the best analyst response?",
    options: [
      "Agree — 75% false flag rate means the rule is useless",
      "Disagree — evaluate using conditional probability and base rates; a rare event (0.3% fraud) means even useful rules can have many false positives among all alerts",
      "Disagree — 25% is high enough that every flag should result in an automatic chargeback",
      "Agree — when events are dependent, probability rules do not apply"
    ],
  },
  {
    id: 15,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "medium",
    multiSelect: false,
    question: "In one day, a customer either buys online (event O) or in-store (event S) for a given product category, never both the same day. P(O)=0.65, P(S)=0.35. Which statement is correct?",
    options: [
      "O and S are independent because they are different channels",
      "O and S are mutually exclusive and P(O ∪ S) = 1",
      "P(O ∪ S) = 0.65 + 0.35 − (0.65×0.35) by the general addition rule",
      "P(O ∩ S) = 0.65 × 0.35 because purchases are random"
    ],
  },
  {
    id: 16,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "hard",
    multiSelect: true,
    question: "An email campaign has P(open) = 0.22 and P(click | open) = 0.12. The owner wants to understand overall engagement. Which calculations or statements are correct? (Select all that apply)",
    options: [
      "P(open AND click) = 0.22 × 0.12 = 0.0264",
      "P(click | open) = P(open AND click) / P(open)",
      "P(click) = 0.12 for all recipients, so 12% of everyone clicks",
      "Events \\\"open\\\" and \\\"click\\\" are dependent — clicking requires opening first in this funnel"
    ],
  },
  {
    id: 17,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "medium",
    multiSelect: false,
    question: "Quality control: P(defective part) = 0.02 per item, inspected independently. For a single item, which framework applies? For counting defects in a batch of 50 independent items, which framework applies?",
    options: [
      "Binomial for one item; Bernoulli for 50 items",
      "Bernoulli for one item; Binomial(n=50, p=0.02) for the batch count",
      "Normal for both",
      "Uniform for one item; Poisson only for 50 items"
    ],
  },
  {
    id: 18,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "hard",
    multiSelect: false,
    question: "A product manager argues: \\\"90% of users who churned never used Feature X, so requiring Feature X will cut churn by 90%.\\\" What is the critical flaw in this reasoning?",
    options: [
      "They should use the median instead of a percentage",
      "They confuse P(did not use X | churned) with P(churn | did not use X) — conditional probability direction matters; most users may never use X anyway",
      "Churn and feature usage are always independent",
      "90% is too high to be reported in a dashboard"
    ],
  },
  {
    id: 19,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "medium",
    multiSelect: false,
    question: "A mobile game offers: win +6 gems (probability 0.30) or lose −3 gems (probability 0.70) per play. The designer says it is \\\"fair because wins are bigger than losses.\\\" What is E[X] per play, and what do you advise the product owner?",
    options: [
      "E[X] = +0.9 gems; the game favors players long-term",
      "E[X] = −0.3 gems; players lose on average despite larger wins — the house has an edge",
      "E[X] = 0; fair because probabilities balance the outcomes",
      "E[X] = +3 gems; subtract 0.70 − 0.30 and multiply by 6"
    ],
  },
  {
    id: 20,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "hard",
    multiSelect: false,
    question: "A shop owner tracks weekly click-through rate on the same online banner. Each week has 200 independent impressions. Observed rates over 5 weeks: 8%, 12%, 9%, 11%, 10%. The owner says: \\\"Our true click rate is exactly 10% now.\\\" Why is this conclusion statistically weak?",
    options: [
      "The mean of the five weekly rates is always the true population rate with no uncertainty",
      "Each weekly rate is a random outcome; with small samples (n=200), short-run variation is large — LLN applies as the number of trials grows, not because five noisy weekly estimates average to the truth",
      "Click rates cannot be modeled as random variables",
      "10% is invalid because the mode of the five values is not 10%"
    ],
  },
  {
    id: 21,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "medium",
    multiSelect: false,
    question: "An email campaign will reach 5,000 users. Each user opens independently with probability p = 0.08. Let X = number of opens. What is E[X], and why might the actual opens differ from E[X]?",
    options: [
      "E[X] = 400; actual opens may differ because X is random — variance = 5000×0.08×0.92 = 368",
      "E[X] = 0.08; opens are deterministic",
      "E[X] = 40; multiply 5000 by 0.008",
      "E[X] = 400; actual opens must equal 400 exactly by the Law of Large Numbers"
    ],
  },
  {
    id: 22,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "hard",
    multiSelect: true,
    question: "A call center models each inbound call as an independent Bernoulli trial: \\\"resolved on first contact\\\" with p = 0.75. Over 200 calls in a day, which statements are correct? (Select all that apply)",
    options: [
      "The total number of first-contact resolutions follows Binomial(n=200, p=0.75)",
      "Expected resolutions = 150, but observing 140 or 160 is plausible due to variance",
      "Each call must resolve exactly 75% of the time every single day with no variation",
      "Simulating many days of 200 calls can demonstrate Law of Large Numbers on the daily resolution rate"
    ],
  },
  {
    id: 23,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "medium",
    multiSelect: false,
    question: "Two promotions have the same per-user conversion probability p = 0.05. Promotion A targets 200 users; Promotion B targets 2,000 users. Which comparison about total conversions is most accurate?",
    options: [
      "Both campaigns will produce exactly the same number of conversions",
      "B has higher expected conversions (100 vs 10) and also higher absolute variability in total conversions",
      "A is less risky because smaller samples have no variance",
      "Expected conversions are equal because p is the same"
    ],
  },
  {
    id: 24,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "hard",
    multiSelect: false,
    question: "You simulate 50,000 fair coin tosses and observe 49.6% heads. A colleague insists the coin must be biased because it is not exactly 50%. How do you explain this using course concepts?",
    options: [
      "Reject simulation — only theoretical math is valid",
      "49.6% is consistent with randomness; with large n, sample proportion should be near 0.5 but not identical — LLN explains convergence, not perfection at any finite n",
      "49.6% proves bias because 0.4% deviation is large",
      "Variance of a Bernoulli trial is zero for large n"
    ],
  },
  {
    id: 25,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "medium",
    multiSelect: false,
    question: "You fit daily ice-cream sales (y) vs temperature in °C (x) using ŷ = β₀ + β₁·x. The fitted model is ŷ = 50 + 120x (so β₀ = 50, β₁ = 120) with R² = 0.88. The owner asks: \\\"What do you predict for a 0°C day?\\\" What is the best analyst response?",
    options: [
      "ŷ = 50 cones — always trust the intercept literally",
      "ŷ = 50 is a mathematical extrapolation; predicting at x=0 may be outside the data range and unreliable even with high R²",
      "R² = 0.88 means 88% of days had exactly the predicted sales",
      "Set x=0 to the mean temperature and report that instead without explanation"
    ],
  },
  {
    id: 26,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "hard",
    multiSelect: false,
    question: "A pricing analyst fits linear regression: price (x) vs daily demand (y) and gets R² = 0.91. The residual plot shows a clear U-shape (residuals negative at low and high prices, positive in the middle). The director wants to deploy the model for pricing. What do you recommend?",
    options: [
      "Deploy immediately — R² = 0.91 proves excellent fit",
      "Do not deploy as a linear model; the U-shaped residuals suggest non-linear price sensitivity — investigate transformations or non-linear models",
      "Remove all high-price products and refit until residuals look random",
      "Flip x and y so R² becomes 1"
    ],
  },
  {
    id: 27,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "medium",
    multiSelect: true,
    question: "For a simple OLS model ŷ = β₀ + β₁·x, where y is monthly marketing spend and x is new customers acquired, which statements connect regression to descriptive statistics? (Select all that apply)",
    options: [
      "The regression line passes through (x̄, ȳ)",
      "β₁ = Cov(x, y) / Var(x)",
      "β₀ = ȳ − β₁·x̄",
      "Minimizing sum of absolute residuals is the standard OLS objective"
    ],
  },
  {
    id: 28,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "hard",
    multiSelect: false,
    question: "A model predicting monthly revenue from foot traffic has R² = 0.35. The baseline model always predicts the historical mean revenue (ȳ). How should you explain R² = 0.35 to a non-technical owner?",
    options: [
      "Foot traffic explains about 35% of the month-to-month variation in revenue compared to guessing the average every time",
      "35% of customers are explained by the model",
      "The model is wrong 65% of the time for every single day",
      "R² = 0.35 means correlation is 0.35"
    ],
  },
  {
    id: 29,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "hard",
    multiSelect: false,
    question: "Model A: R² = 0.87 but residuals vs fitted show a funnel shape (spread grows with fitted values). Model B: R² = 0.74 with residuals randomly scattered around zero. The owner picks Model A because \\\"higher R² means better predictions.\\\" What is your assessment?",
    options: [
      "Agree — always choose highest R²",
      "Prefer Model B for reliable inference/prediction if residuals are well-behaved; Model A's funnel suggests heteroscedasticity and poor reliability at certain ranges despite high R²",
      "Pick neither — R² is useless",
      "Funnel residuals mean you should only use the median, not regression"
    ],
  },
  {
    id: 30,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "medium",
    multiSelect: false,
    question: "A store manager fits ŷ = β₀ + β₁·x for daily sales (y) vs staffing hours (x) and finds β₁ = 400. They say: \\\"Each extra hour adds $400, so doubling staff from 2 to 4 hours will always add exactly $800 tomorrow.\\\" What nuance should the data scientist add?",
    options: [
      "None — regression coefficients are guaranteed causal effects",
      "The slope is an average historical association; tomorrow's outcome is uncertain, the relationship may be non-linear, and staffing may not cause sales without controlling confounders",
      "β₁=400 means R² must be at least 0.40",
      "Doubling x always doubles y in every regression"
    ],
  },
  {
    id: 31,
    topic: "matplotlib",
    topicLabel: "Matplotlib & Visualization",
    difficulty: "hard",
    multiSelect: false,
    question: "You present Figure 1 to the board. The CFO claims: \\\"MRR grew every single month in 2024, so our retention strategy never faltered.\\\" Which response is best supported by reading the line chart carefully?",
    options: [
      "The CFO is correct — the line only moves upward",
      "MRR declined month-over-month twice: March→April ($128k to $125k) and August→September ($155k to $149k); overall trend is up, but not monotonic",
      "December is the only month with lower MRR than January",
      "Line charts cannot display month-to-month changes"
    ],
    chart: "line_mrr",
    chartCaption: "Figure 1 — Monthly recurring revenue (MRR), FinTech SaaS product, 2024",
  },
  {
    id: 32,
    topic: "matplotlib",
    topicLabel: "Matplotlib & Visualization",
    difficulty: "hard",
    multiSelect: true,
    question: "The marketing VP asks whether ad spend is worth scaling. Based on Figure 2, which interpretations are justified? (Select all that apply)",
    options: [
      "Most weeks show a positive association — higher spend tends to coincide with higher revenue",
      "The triangular marker (~$60k spend, ~$95k revenue) is an outlier under-performing relative to peers at similar spend",
      "The scatter proves that doubling spend will exactly double revenue next week",
      "A scatter plot is appropriate here because both variables are numeric and each point is one observation"
    ],
    chart: "scatter_marketing",
    chartCaption: "Figure 2 — Weekly digital ad spend vs revenue, 24 campaigns + 1 flagged week",
  },
  {
    id: 33,
    topic: "matplotlib",
    topicLabel: "Matplotlib & Visualization",
    difficulty: "medium",
    multiSelect: false,
    question: "Operations wants to set a service-level target. The manager says: \\\"Most customers wait over 10 minutes.\\\" What does Figure 3 (histogram) show?",
    options: [
      "The manager is correct — the tallest bars are on the right",
      "Most calls fall in the 0–4 minute range (bins 0–2 and 2–4 dominate); the distribution is right-skewed with a long tail of long waits",
      "Wait times are uniformly distributed across all bins",
      "A histogram is the wrong chart — use a pie chart for numeric wait times"
    ],
    chart: "histogram_wait",
    chartCaption: "Figure 3 — Customer wait times before agent pickup (1,753 calls)",
  },
  {
    id: 34,
    topic: "matplotlib",
    topicLabel: "Matplotlib & Visualization",
    difficulty: "hard",
    multiSelect: true,
    question: "Supply-chain leadership must nominate one hub for a \\\"fast shipping\\\" guarantee. Using Figure 4 (box plot), which statements are valid? (Select all that apply)",
    options: [
      "Central Hub has the lowest median fulfillment time (~2.4 days) and the tightest box — most consistent performance",
      "West Hub shows the widest spread (largest IQR) and an extreme outlier near 11.6 days that warrants investigation",
      "North and Central hubs have identical medians because both use cool colors",
      "Box plots compare distributions across categories and expose median, spread, and outliers in one view"
    ],
    chart: "boxplot_fulfillment",
    chartCaption: "Figure 4 — Order fulfillment time (days) by warehouse hub",
  },
  {
    id: 35,
    topic: "matplotlib",
    topicLabel: "Matplotlib & Visualization",
    difficulty: "medium",
    multiSelect: false,
    question: "The CEO asks: \\\"Which channel drove Q4, and how much more did it generate than our B2B portal?\\\" What answer matches Figure 5?",
    options: [
      "B2B Portal led Q4 with $2.7M — invest there first",
      "Website led Q4 at $6.8M, generating $4.1M more than B2B Portal ($2.7M)",
      "All five channels are equal because the chart has five bars",
      "Marketplace ($3.4M) beat Website ($6.8M) — bar charts compare time series"
    ],
    chart: "bar_channels",
    chartCaption: "Figure 5 — Q4 revenue by sales channel ($ millions)",
  },
];

const TOPICS = {
  descriptive_statistics: "Descriptive Statistics",
  pandas: "Pandas & Data Analysis",
  probability: "Probability",
  random_variables: "Discrete Random Variables",
  linear_regression: "Linear Regression",
  matplotlib: "Matplotlib & Visualization",
};
