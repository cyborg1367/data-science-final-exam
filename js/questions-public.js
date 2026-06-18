const EXAM_QUESTIONS = [
  {
    id: 1,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "A food-delivery owner asks: \"What does a typical customer order look like?\" You compute mean order value = $84 and median = $58. The histogram has a long right tail (a few very large catering orders). Which answer is most honest and useful?",
    options: [
      "Use the mean ($84) — it uses every order and is best for total revenue planning",
      "Use the median ($58) — a few huge catering orders pull the mean up, so the middle value fits \"typical\" better",
      "Use the mean ($84) — skew only changes spread, not which center measure you should report",
      "Use the median ($58) — mean and median always give the same business answer when both are known"
    ],
  },
  {
    id: 2,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "A marketing director shows you a scatter plot: monthly ad spend (x) vs revenue (y) with correlation r = 0.93. They conclude: \"Cutting ad spend in half will roughly halve our revenue.\" As a data analyst, your best response is:",
    options: [
      "Agree — r = 0.93 means ad spend explains most revenue swings, so halving spend should roughly halve revenue",
      "Disagree — strong correlation shows they moved together in the past, not that cutting ads would cause that drop",
      "Disagree — you need a negative correlation before recommending spending cuts",
      "Agree — with r above 0.9 the line is steep enough to treat ad spend as the main revenue driver"
    ],
  },
  {
    id: 3,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "medium",
    multiSelect: true,
    capstone: false,
    question: "An HR manager wants to compare salary \"fairness\" across two departments. Department A: salaries tightly clustered around $55k (low spread). Department B: same average but salaries range from $35k to $90k (high spread). Which statements reflect correct statistical reasoning? (Select all that apply)",
    options: [
      "Equal means can still hide very different salary spreads and employee experiences",
      "Standard deviation measures how far individual salaries sit from the department mean",
      "Equal means mean the two departments should get the same HR policy",
      "Higher variance in B means more within-department salary spread than in A"
    ],
  },
  {
    id: 4,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "A warehouse logs package delivery times (days). Q1 = 2, Q3 = 5. Using the IQR outlier rule, values above Q3 + 1.5×IQR are flagged. One route shows delivery times: 2, 3, 3, 4, 4, 5, 11. The owner asks whether 11 is a data error. What is the best analyst conclusion?",
    options: [
      "Delete 11 now — values above Q3 are usually data-entry mistakes",
      "11 is above the 9.5 fence, so flag it as an outlier and check the route before deleting",
      "Keep 11 — it is only a few days above the smallest delivery time in the list",
      "Keep 11 — compare it to the mean delivery time, not the IQR rule in the question"
    ],
  },
  {
    id: 5,
    topic: "descriptive_statistics",
    topicLabel: "Descriptive Statistics",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "A café owner studies monthly revenue vs number of rainy days per month and finds covariance Cov(rain_days, revenue) = −4,200. Rainy days per month has variance Var(rain_days) = 25,000. For the linear model ŷ = β₀ + β₁·(rain_days), where ŷ is predicted monthly revenue, what is β₁ (the slope)?",
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
    capstone: false,
    question: "A retail owner compares two stores using boxplots of daily foot traffic. Store X's box is narrow and centered high; Store Y's box is wide with a long lower whisker. Which conclusions are statistically justified? (Select all that apply)",
    options: [
      "Store X has less day-to-day traffic variation than Store Y",
      "Store Y likely has more unusually low-traffic days relative to its usual range",
      "Store X's higher typical traffic proves it earns more revenue than Store Y",
      "Side-by-side boxplots help compare medians and typical ranges between stores"
    ],
  },
  {
    id: 7,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "A shop owner asks: \"Which city generated the most total revenue last quarter?\" You have a CSV with columns: order_id, city, revenue, order_date (stored as text \"2024-03-15\"). What is the most appropriate first step in your analysis pipeline?",
    options: [
      "df.groupby('city')['revenue'].sum().idxmax() — group and sum first, then find the top city",
      "Check dtypes, parse order_date, filter to last quarter, then sum revenue by city",
      "df.loc[df['revenue'].idxmax(), 'city'] — the city attached to the largest single order",
      "df.dropna().groupby('city')['order_id'].count() — rank cities by number of orders"
    ],
  },
  {
    id: 8,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "You load a customer dataset for churn analysis. df.isna().sum() shows customer_age is missing for 38% of rows. The junior analyst runs df.dropna() and builds the report. What is the main problem?",
    options: [
      "dropna() is fine here — 38% missing is normal in customer datasets",
      "You may lose almost 40% of rows, and bias creeps in if missing age is not random",
      "Missing age only hurts charts; the churn model still uses all other columns fairly",
      "fillna(df['age'].mean()) removes missing values with no effect on results"
    ],
  },
  {
    id: 9,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "An e-commerce owner asks: \"What is the average order value (AOV) per region for active customers only?\" Each row is one line item (multiple rows per order_id). Which logic best matches the business question?",
    options: [
      "df[df['status']=='active'].groupby('region')['price'].mean()",
      "Filter active customers → sum line items by order_id → average those order totals by region",
      "df[df['status']=='active'].groupby('region')['order_id'].nunique()",
      "df[df['status']=='active'].groupby('region')['price'].sum() / df.groupby('region').size()"
    ],
  },
  {
    id: 10,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "medium",
    multiSelect: true,
    capstone: false,
    question: "During EDA on sales data, you find 120 duplicate order_id rows (exact copies). The owner asks whether revenue totals are trustworthy. Which actions reflect sound data-analysis thinking? (Select all that apply)",
    options: [
      "Check whether duplicates are errors, re-exports, or valid repeats before acting",
      "Count duplicates and inspect a sample of duplicated rows",
      "Drop duplicates immediately so reported revenue looks cleaner",
      "After finding the cause, deduplicate if needed and note how revenue changed"
    ],
  },
  {
    id: 11,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "The CEO asks: \"Why did March sales drop 15% compared to February?\" You have daily sales, marketing spend, product returns, and a holiday calendar. What should you do FIRST?",
    options: [
      "Run a regression of March sales on marketing spend and report the slope",
      "Slice March vs February by product, channel, and region before picking one cause",
      "Tell the CEO the 15% drop — that already answers why sales fell",
      "Cap extreme March days at the 95th percentile and recompute the month-over-month change"
    ],
  },
  {
    id: 12,
    topic: "pandas",
    topicLabel: "Pandas & Data Analysis",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "A pandas chain returns the top 3 salespeople by total revenue:\n\ndf.groupby('salesperson')['revenue'].sum().sort_values(ascending=False).head(3)\n\nThe owner then asks for the same ranking but excluding refunded orders (refund_flag == 1). Which modification preserves correct business logic?",
    options: [
      "df.groupby('salesperson')['revenue'].sum().head(3) — refund rows are usually tiny",
      "df[df['refund_flag']==0].groupby('salesperson')['revenue'].sum().sort_values(ascending=False).head(3)",
      "df.sort_values('revenue', ascending=False).groupby('salesperson')['revenue'].sum().head(3)",
      "df[df['refund_flag']==0].groupby('salesperson')['revenue'].mean().nlargest(3)"
    ],
  },
  {
    id: 13,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "A digital marketer reports: P(customer clicks ad) = 0.04 and P(customer purchases | clicked ad) = 0.10. What is P(click AND purchase)?",
    options: [
      "0.14",
      "0.004",
      "0.40",
      "0.024"
    ],
  },
  {
    id: 14,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "A fraud-detection rule flags 2% of transactions. Historically, 0.3% of all transactions are actually fraudulent. When the rule fires, only 25% of flagged transactions turn out to be fraud. A manager says: \"The rule is wrong 75% of the time, so scrap it.\" What is the best analyst response?",
    options: [
      "Agree — 75% wrong flags means the rule is mostly useless",
      "Disagree — compare 25% fraud among flags with 0.3% fraud overall; rare events create many false alerts even when the rule helps",
      "Disagree — charge back every flagged transaction because 25% is a strong hit rate",
      "Agree — conditional probability does not apply when fraud and flags are related"
    ],
  },
  {
    id: 15,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "In one day, a customer either buys online (event O) or in-store (event S) for a given product category, never both the same day. P(O)=0.65, P(S)=0.35. Which statement is correct?",
    options: [
      "O and S are independent because customers pick one channel or the other",
      "O and S are mutually exclusive, so P(O ∪ S) = 0.65 + 0.35 = 1",
      "P(O ∪ S) = 0.65 + 0.35 − (0.65×0.35) by the general addition rule",
      "P(O ∩ S) = 0.65 × 0.35 because the two probabilities look like a random split"
    ],
  },
  {
    id: 16,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "hard",
    multiSelect: true,
    capstone: false,
    question: "An email campaign has P(open) = 0.22 and P(click | open) = 0.12. The owner wants to understand overall engagement. Which calculations or statements are correct? (Select all that apply)",
    options: [
      "P(open AND click) = 0.22 × 0.12 = 0.0264",
      "P(click | open) = P(open AND click) / P(open)",
      "P(click) = 0.12 for all recipients because 12% of people click",
      "Open and click are dependent in this funnel because clicking requires opening first"
    ],
  },
  {
    id: 17,
    topic: "probability",
    topicLabel: "Probability",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
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
    capstone: false,
    question: "A product manager argues: \"90% of users who churned never used Feature X, so requiring Feature X will cut churn by 90%.\" What is the critical flaw in this reasoning?",
    options: [
      "They should use median churn instead of a percentage",
      "They confuse P(no X | churned) with P(churn | no X); most users may never use X anyway",
      "Churn and feature usage must be independent in product analytics",
      "90% is too high to show on an executive dashboard"
    ],
  },
  {
    id: 19,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "A mobile game offers: win +6 gems (probability 0.30) or lose −3 gems (probability 0.70) per play. The designer says it is \"fair because wins are bigger than losses.\" What is E[X] per play, and what do you advise the product owner?",
    options: [
      "E[X] = +0.9 gems; bigger wins mean players come out ahead over time",
      "E[X] = −0.3 gems; losses happen more often, so players lose on average",
      "E[X] = 0; +6 and −3 balance because 6 is twice 3",
      "E[X] = +3 gems; use (0.30 − 0.70) × 6"
    ],
  },
  {
    id: 20,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "A shop owner tracks weekly click-through rate on the same online banner. Each week has 200 independent impressions. Observed rates over 5 weeks: 8%, 12%, 9%, 11%, 10%. The owner says: \"Our true click rate is exactly 10% now.\" Why is this conclusion statistically weak?",
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
    capstone: false,
    question: "An email campaign will reach 5,000 users. Each user opens independently with probability p = 0.08. Let X = number of opens. What is E[X], and why might the actual opens differ from E[X]?",
    options: [
      "E[X] = 400; actual opens can differ because Var(X) = 5000×0.08×0.92",
      "E[X] = 400; one campaign must land exactly on 400 opens by the Law of Large Numbers",
      "E[X] = 0.08; that is the per-user open probability, not the expected count",
      "E[X] = 40; multiply 5000 by 0.008"
    ],
  },
  {
    id: 22,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "hard",
    multiSelect: true,
    capstone: false,
    question: "A call center models each inbound call as an independent Bernoulli trial: \"resolved on first contact\" with p = 0.75. Over 200 calls in a day, which statements are correct? (Select all that apply)",
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
    capstone: false,
    question: "Two promotions have the same per-user conversion probability p = 0.05. Promotion A targets 200 users; Promotion B targets 2,000 users. Which comparison about total conversions is most accurate?",
    options: [
      "Both campaigns should produce the same number of conversions because p is equal",
      "B expects about 100 conversions vs 10 for A, and also has larger absolute spread in totals",
      "A is safer because smaller samples have no random variation",
      "Expected conversions match because the per-user rate is 5% in both"
    ],
  },
  {
    id: 24,
    topic: "random_variables",
    topicLabel: "Discrete Random Variables",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
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
    capstone: false,
    question: "You fit daily ice-cream sales (y) vs temperature in °C (x) using ŷ = β₀ + β₁·x. The fitted model is ŷ = 50 + 120x (so β₀ = 50, β₁ = 120) with R² = 0.88. The owner asks: \"What do you predict for a 0°C day?\" What is the best analyst response?",
    options: [
      "Predict 50 cones — plug x = 0 into ŷ = 50 + 120x; R² = 0.88 supports that number",
      "50 is the intercept math, but 0°C may lie outside the temperatures used to fit the model",
      "R² = 0.88 means about 88% of days matched the prediction exactly",
      "Use the mean temperature instead of 0°C without explaining the change to the owner"
    ],
  },
  {
    id: 26,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "A pricing analyst fits linear regression: price (x) vs daily demand (y) and gets R² = 0.91. The residual plot shows a clear U-shape (residuals negative at low and high prices, positive in the middle). The director wants to deploy the model for pricing. What do you recommend?",
    options: [
      "Deploy now — R² = 0.91 is strong enough for pricing decisions",
      "Pause deployment — U-shaped residuals suggest the linear form is wrong; try a curve or transform",
      "Remove high-price products and refit until residuals look random, then deploy",
      "Swap price and demand columns — that fixes U-shaped residuals"
    ],
  },
  {
    id: 27,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "medium",
    multiSelect: true,
    capstone: false,
    question: "For a simple OLS model ŷ = β₀ + β₁·x, where y is monthly marketing spend and x is new customers acquired, which statements connect regression to descriptive statistics? (Select all that apply)",
    options: [
      "The fitted line always passes through (x̄, ȳ)",
      "β₁ = Cov(x, y) / Var(x)",
      "β₀ = ȳ − β₁·x̄",
      "OLS minimizes the sum of absolute residuals |y − ŷ|"
    ],
  },
  {
    id: 28,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "A model predicting monthly revenue from foot traffic has R² = 0.35. The baseline model always predicts the historical mean revenue (ȳ). How should you explain R² = 0.35 to a non-technical owner?",
    options: [
      "Foot traffic explains about 35% of month-to-month revenue variation beyond always guessing the average",
      "The model correctly labels 35% of customers",
      "The model is wrong on 65% of individual days",
      "Foot traffic and revenue have correlation r = 0.35"
    ],
  },
  {
    id: 29,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "Model A: R² = 0.87 but residuals vs fitted show a funnel shape (spread grows with fitted values). Model B: R² = 0.74 with residuals randomly scattered around zero. The owner picks Model A because \"higher R² means better predictions.\" What is your assessment?",
    options: [
      "Pick Model A — higher R² always means better predictions",
      "Prefer Model B — random residuals beat Model A's funnel pattern for reliable forecasts",
      "Reject both models because R² is misleading in every case",
      "Funnel residuals mean you should report only the median of y, not use regression"
    ],
  },
  {
    id: 30,
    topic: "linear_regression",
    topicLabel: "Linear Regression",
    difficulty: "medium",
    multiSelect: false,
    capstone: false,
    question: "A store manager fits ŷ = β₀ + β₁·x for daily sales (y) vs staffing hours (x) and finds β₁ = 400. They say: \"Each extra hour adds $400, so doubling staff from 2 to 4 hours will always add exactly $800 tomorrow.\" What nuance should the data scientist add?",
    options: [
      "No nuance needed — β₁ = 400 is the causal effect of one extra staff hour",
      "The slope is a historical average link; tomorrow varies, the curve may bend, and busy days may drive both staff and sales",
      "β₁ = 400 means R² must be at least 0.40",
      "In regression, doubling x always doubles y"
    ],
  },
  {
    id: 31,
    topic: "matplotlib",
    topicLabel: "Matplotlib & Visualization",
    difficulty: "hard",
    multiSelect: false,
    capstone: false,
    question: "You present Figure 1 to the board. The CFO claims: \"MRR grew every single month in 2024, so our retention strategy never faltered.\" Which response is best supported by reading the line chart carefully?",
    options: [
      "The CFO is right — year-end MRR is above January, so every month grew",
      "MRR fell month-over-month twice (Mar→Apr and Aug→Sep); the year trends up but not every month",
      "Only December is lower than January — that is the sole dip",
      "A line chart cannot show month-to-month changes"
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
    capstone: false,
    question: "The marketing VP asks whether ad spend is worth scaling. Based on Figure 2, which interpretations are justified? (Select all that apply)",
    options: [
      "Higher spend weeks usually line up with higher revenue",
      "The flagged week (~$60k spend, ~$95k revenue) underperforms similar-spend weeks",
      "The chart proves doubling spend will exactly double revenue next week",
      "A scatter plot fits here because both axes are numeric and each point is one week"
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
    capstone: false,
    question: "Operations wants to set a service-level target. The manager says: \"Most customers wait over 10 minutes.\" What does Figure 3 (histogram) show?",
    options: [
      "The manager is right — the long right tail means most customers wait over 10 minutes",
      "Most calls fall in the 0–4 minute bins; waits are right-skewed with a thin tail of long waits",
      "Counts look roughly equal across all wait-time bins",
      "A pie chart would show wait-time shares more clearly than this histogram"
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
    capstone: false,
    question: "Supply-chain leadership must nominate one hub for a \"fast shipping\" guarantee. Using Figure 4 (box plot), which statements are valid? (Select all that apply)",
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
    capstone: false,
    question: "The CEO asks: \"Which channel drove Q4, and how much more did it generate than our B2B portal?\" What answer matches Figure 5?",
    options: [
      "B2B Portal led Q4 with $2.7M — invest there first",
      "Website led Q4 at $6.8M, generating $4.1M more than B2B Portal ($2.7M)",
      "All five channels are equal because the chart has five bars",
      "Marketplace ($3.4M) beat Website ($6.8M) — bar charts compare time series"
    ],
    chart: "bar_channels",
    chartCaption: "Figure 5 — Q4 revenue by sales channel ($ millions)",
  },
  {
    id: 36,
    topic: "capstone",
    topicLabel: "Final Integration",
    difficulty: "hard",
    multiSelect: true,
    capstone: true,
    question: "Which statements belong in an honest analyst memo before the rainy-season campaign? Select every statement that is statistically sound.",
    options: [
      "Use the median (~$58) for \"typical order size\" — a few large catering orders pull the mean toward $84.",
      "Before modeling, check why 38% of ages are missing; blind dropna() can bias who stays in the sample.",
      "P(click AND purchase) = 0.04 × 0.10 = 0.004 across all users, not 0.14.",
      "R² = 0.72 is useful, but funnel-shaped residuals mean high-revenue predictions are less reliable.",
      "Central Hub looks fastest and most consistent; investigate West Hub's ~11.6-day point before a speed pledge.",
      "Mean $84 alone is the right \"typical order\" because it counts every order equally.",
      "End-to-end purchase rate is 0.04 + 0.10 = 0.14 because both funnel steps are small.",
      "The negative rain slope proves each extra rainy day always causes exactly $168 less revenue, causally."
    ],
    capstonePanels: [
      {
        icon: "clipboard",
        title: "Dataset",
        text: "Each row is one line item (many rows can share one order_id).\ncustomer_age is missing in 38% of rows.\norder_date is stored as text — parse before filtering by quarter.",
      },
      {
        icon: "chart",
        title: "Order values",
        text: "Mean order value = $84.\nMedian order value = $58.\nHistogram is right-skewed: a few very large catering orders.",
      },
      {
        icon: "bolt",
        title: "Campaign funnel",
        text: "P(customer clicks ad) = 0.04.\nP(customer purchases | clicked) = 0.10.\nOwner wants the end-to-end rate across all users.",
      },
      {
        icon: "target",
        title: "Rain vs revenue model",
        text: "Linear fit: monthly revenue vs rainy days; slope β₁ = −0.168.\nR² = 0.72 on past months.\nResidual plot: errors spread wider at higher fitted revenue (funnel shape).",
      },
      {
        icon: "chart",
        title: "Delivery hubs",
        text: "Central Hub: lowest median time (~2.4 days) and tightest box.\nWest Hub: widest spread; one point ~11.6 days (possible outlier).\nOwner may promise \"fast shipping\" from one hub.",
      },
    ],
  },
];

const TOPICS = {
  descriptive_statistics: "Descriptive Statistics",
  pandas: "Pandas & Data Analysis",
  probability: "Probability",
  random_variables: "Discrete Random Variables",
  linear_regression: "Linear Regression",
  matplotlib: "Matplotlib & Visualization",
  capstone: "Final Integration",
};
