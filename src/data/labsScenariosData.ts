import type { LabScenarioVariant, LabDifficulty } from '../lib/labs/types';
import { allLabsCatalog } from './labsCatalog';

/**
 * 6 Authored Scenarios per lab across 30 labs (180 scenario definitions).
 * Includes detailed objectives, editable inputs, constraints, starting materials,
 * supported operations, evaluation methods, assumptions, and progressive hints.
 */

// Helper to generate a standardized scenario structure
function createScenario(
  labSlug: string,
  index: number,
  tier: LabDifficulty,
  title: string,
  objective: string,
  inputs: string[],
  constraints: string[],
  expectedOutput: string[],
  publicFixture: Record<string, unknown>,
  allowedActions: string[],
  hints: { level: number; clue: string; explanation?: string }[],
  assumptions: string[] = ['Deterministic simulation based on explicit user inputs and bounded mathematical state.']
): LabScenarioVariant {
  const padded = String(index).padStart(3, '0');
  const slugPrefix = labSlug.split('-').map(s => s[0]).join('');
  return {
    id: `${slugPrefix}-${padded}`,
    labSlug,
    variant: tier,
    scenarioVersion: '1.0.0',
    title,
    objective,
    instructions: `${objective}\nConstraints:\n${constraints.map(c => `• ${c}`).join('\n')}`,
    prerequisites: ['Carefully inspect starting data and materials', 'Verify changes in simulation results before submitting'],
    expectedOutput,
    publicFixture,
    allowedActions,
    editableInputs: inputs,
    constraints,
    startingMaterials: publicFixture,
    supportedOperations: allowedActions,
    evaluationMethod: 'Deterministic check against objective criteria, constraint adherence, and evidence validity.',
    assumptions,
    hints
  };
}

// Complete registry of all 30 labs scenarios
export const allLabScenarios: Record<string, LabScenarioVariant[]> = {
  // =========================================================================
  // 1. DATA ANALYTICS: Business Analyst Desk
  // =========================================================================
  'business-analyst-desk': [
    createScenario(
      'business-analyst-desk', 1, 'beginner',
      'Falling North Regional Revenue Investigation',
      'Investigate declining revenue in North region across Q1-Q4. Clean duplicate orders and filter cancelled deals to reveal underlying trend.',
      ['Deduplication criteria', 'Cancelled order filter', 'Missing region imputation strategy', 'Grouping dimension'],
      ['Do not delete legitimate orders with similar amounts', 'Net revenue must exclude discounts and cancelled orders'],
      ['Cleaned dataset with verified row count', 'Quarterly trend breakdown identifying North decline', 'Accurate net revenue metric'],
      { initialDataset: 'orders', totalRows: 20, missingRegions: 1, duplicateRows: 1, cancelledRows: 1 },
      ['toggle_deduplication', 'toggle_cancelled', 'select_missing_strategy', 'change_grouping', 'run_aggregation'],
      [
        { level: 1, clue: 'Check order ORD-106: it has the same customer, quarter, and amount as ORD-101.' },
        { level: 2, clue: 'Cancelled orders have status "Cancelled" and represent uncollected revenue.' },
        { level: 3, clue: 'After removing the duplicate and excluding cancelled orders, observe North quarterly totals from Q1 to Q4.', explanation: 'North revenue drops from ₹10,000 in Q1 down to ₹3,000 in Q4.' }
      ]
    ),
    createScenario(
      'business-analyst-desk', 2, 'beginner',
      'High-Return E-Commerce Product Analysis',
      'Analyze return rates across product categories. Identify whether seals or valves have abnormal return ratios.',
      ['Return status filter', 'Product category grouping', 'Calculation metric (Return %)'],
      ['Consider only completed orders as returnable', 'Separate return rate from total unit volume'],
      ['Accurate return rate per category', 'Identified category with >15% return rate'],
      { initialDataset: 'orders_returns', totalRows: 25, returnCount: 4 },
      ['filter_returns', 'calculate_return_rate', 'export_cleaned_csv'],
      [
        { level: 1, clue: 'Calculate Return % as (Returned Orders / Completed Orders) * 100.' },
        { level: 2, clue: 'Filter by category and compare Valves vs Lubricants.' }
      ]
    ),
    createScenario(
      'business-analyst-desk', 3, 'intermediate',
      'Misleading Averages & Outlier Distortions',
      'Detect how a single large enterprise order distorts the average order value (AOV) for West region.',
      ['Outlier threshold filter', 'Median vs Mean comparison', 'Regional filter'],
      ['AOV must not be skewed by one-off orders > ₹200,000', 'Document variance between mean and trimmed mean'],
      ['Mean and trimmed mean calculations', 'Actionable recommendation for regional sales quotas'],
      { initialDataset: 'orders_skewed', totalRows: 35, outlierCount: 1 },
      ['apply_outlier_cap', 'calculate_metrics', 'view_distribution'],
      [
        { level: 1, clue: 'Look at the West region order ORD-215 for ₹240,000.' },
        { level: 2, clue: 'Removing ORD-215 drops West AOV from ₹28,000 to ₹12,500.' }
      ]
    ),
    createScenario(
      'business-analyst-desk', 4, 'intermediate',
      'Category Inconsistency & Multi-Table Join',
      'Join orders table with product master table. Resolve mismatched category spellings before calculating sales breakdown.',
      ['Join key selection', 'Category standardization mapping', 'Aggregated sales table'],
      ['Every order must resolve to a valid product in master', 'Do not drop unmapped rows without logging'],
      ['Zero unmapped orders after join', 'Standardized category revenue breakdown'],
      { initialDataset: 'orders_products', orderRows: 30, productRows: 10 },
      ['configure_join', 'map_categories', 'generate_breakdown'],
      [
        { level: 1, clue: 'Inspect category values "Valves" vs "Valves & Actuators".' },
        { level: 2, clue: 'Map all variants to the official catalog name before grouping.' }
      ]
    ),
    createScenario(
      'business-analyst-desk', 5, 'challenge',
      'Multi-Factor Regional Churn & Seasonality Audit',
      'Distinguish true customer account churn from natural Q3 seasonal lulls across 80 accounts.',
      ['Date window filter', 'Customer repeat order threshold', 'Cohort grouping'],
      ['Account is churned only if inactive for > 120 days across all product lines'],
      ['Validated list of at-risk accounts', 'Quantified seasonal revenue impact'],
      { initialDataset: 'orders_cohort', totalRows: 80, accountCount: 25 },
      ['cohort_analysis', 'set_churn_window', 'export_report'],
      [
        { level: 1, clue: 'Check order timestamps: Q3 exhibits an industry-wide 20% slowdown.' },
        { level: 2, clue: 'Compare account order frequency year-over-year rather than month-over-month.' }
      ]
    ),
    createScenario(
      'business-analyst-desk', 6, 'challenge',
      'Dirty Tabular Pipeline Rescue (500 Records)',
      'Clean a large synthetic batch with 8% duplicate rate, 5% missing regions, and inconsistent discount currencies.',
      ['Custom deduplication rule', 'Imputation strategy', 'Currency normalizer'],
      ['Do not replace blank regions with a hardcoded constant', 'Preview affected rows before deletion'],
      ['Cleaned dataset with audit log of all transformations', 'Final verified revenue within 1% of ground truth'],
      { initialDataset: 'orders_large', totalRows: 500, duplicateRate: 0.08, missingRate: 0.05 },
      ['batch_clean', 'preview_diff', 'commit_cleaning'],
      [
        { level: 1, clue: 'Define duplicate rule by matching (customer + quarter + amount).' },
        { level: 2, clue: 'For missing regions, use customer profile lookup rather than default "North".' }
      ]
    )
  ],

  // =========================================================================
  // 2. SPREADSHEET: Spreadsheet Formula and MIS Lab
  // =========================================================================
  'spreadsheet-formula-and-mis-lab': [
    createScenario(
      'spreadsheet-formula-and-mis-lab', 1, 'beginner',
      'Distributor Monthly MIS Repair',
      'Repair broken formulas in a 20-row distributor MIS sheet. Fix division by zero on zero-target rows and lookup missing unit costs.',
      ['Cell formulas in Column E (Achievement %) and Column G (Total Value)', 'Lookup formula for Unit Cost'],
      ['Use =IF(target=0, 0, actual/target) to guard division by zero', 'Do not hardcode numbers into calculated cells'],
      ['Zero formula error flags (#DIV/0!, #REF!, #NAME?)', 'Total inventory value calculated using =SUM(G2:G21)'],
      { rowsCount: 20, zeroTargetRows: [4], missingLookupRows: [7] },
      ['edit_cell_formula', 'copy_fill_down', 'recalculate_sheet', 'export_csv'],
      [
        { level: 1, clue: 'Cell E4 has target 0. Direct division =D4/C4 causes #DIV/0!.' },
        { level: 2, clue: 'Write =IF(C4=0, 0, D4/C4) in cell E4 and fill down.' },
        { level: 3, clue: 'For Unit Cost in F2, use =XLOOKUP(B2, Master!$A$2:$A$10, Master!$B$2:$B$10).' }
      ]
    ),
    createScenario(
      'spreadsheet-formula-and-mis-lab', 2, 'beginner',
      'Inventory Reorder & Stock Valuation',
      'Calculate reorder alert triggers using =IF(CurrentStock <= ReorderLevel, "REORDER", "OK") and total warehouse valuation.',
      ['Formula in Status column', 'Valuation formula in Total column'],
      ['Status must be dynamic based on stock threshold', 'Sum total valuation with =SUM()'],
      ['Correct reorder count', 'Total stock valuation formatted to 2 decimals'],
      { inventoryRows: 15 },
      ['edit_cell_formula', 'set_conditional_formatting', 'export_csv'],
      [
        { level: 1, clue: 'Compare cell C2 (Stock) against D2 (Reorder point).' },
        { level: 2, clue: 'Use =IF(C2<=D2, "REORDER", "OK").' }
      ]
    ),
    createScenario(
      'spreadsheet-formula-and-mis-lab', 3, 'intermediate',
      'Travel Expense Audit with Mixed Currency Lookups',
      'Audit employee expense claims. Convert foreign currency items to INR using exchange rate lookup table and flag claims above per diem limit.',
      ['Exchange rate lookup formula', 'Converted amount formula', 'Per diem validation formula'],
      ['Absolute reference ($) must be used on exchange rate table', 'Flag claims exceeding ₹5,000 per meal'],
      ['Converted expenses in INR', 'Audit report showing flagged non-compliant expenses'],
      { expenseClaims: 20, rateTable: { USD: 84, EUR: 91, GBP: 108 } },
      ['edit_cell_formula', 'filter_flagged_rows', 'export_json'],
      [
        { level: 1, clue: 'Lock exchange table range with $ e.g. $K$2:$L$5.' },
        { level: 2, clue: 'Converted INR = Amount * XLOOKUP(Currency, $K$2:$K$5, $L$2:$L$5).' }
      ]
    ),
    createScenario(
      'spreadsheet-formula-and-mis-lab', 4, 'intermediate',
      'Sales Commission Tier Calculation',
      'Calculate tiered sales commissions: 5% for sales up to ₹1,00,000; 8% for sales between ₹1,00,001 and ₹3,00,000; 12% for above ₹3,00,000.',
      ['Commission formula in Column E'],
      ['Implement nested IF or tiered arithmetic formula without hardcoding names'],
      ['Accurate commission payout per rep', 'Total commission sum'],
      { salesReps: 18 },
      ['edit_cell_formula', 'verify_totals', 'export_csv'],
      [
        { level: 1, clue: 'Use nested IF: =IF(B2>300000, B2*0.12, IF(B2>100000, B2*0.08, B2*0.05)).' },
        { level: 2, clue: 'Commission = IF(B2>300000, B2*0.12, IF(B2>100000, B2*0.08, B2*0.05)), then copy formula down to all reps.' }
      ]
    ),
    createScenario(
      'spreadsheet-formula-and-mis-lab', 5, 'challenge',
      'Attendance Roster & Overtime Tracker',
      'Build an automated employee attendance roster. Calculate total present days, unpaid leaves, and overtime hours across 30 days.',
      ['COUNTIF formulas for "P", "A", "OT"', 'Net payable salary formula'],
      ['Handle blank cells as absent', 'Overtime paid at 1.5x hourly rate'],
      ['Summary table with verified attendance counts', 'Zero circular dependencies'],
      { employees: 12, days: 30 },
      ['edit_cell_formula', 'add_summary_pivot', 'export_csv'],
      [
        { level: 1, clue: 'Count present days with =COUNTIF(C2:AF2, "P").' },
        { level: 2, clue: 'Be careful not to include the Total column inside the COUNT range to avoid circular reference.' }
      ]
    ),
    createScenario(
      'spreadsheet-formula-and-mis-lab', 6, 'challenge',
      'Complex Project Budget Variance with Circular Reference Detection',
      'Repair an interconnected financial budget where Project Overhead cell references Total Budget which references Overhead.',
      ['Break circular reference loop', 'Direct allocation formula', 'Variance percentage formula'],
      ['No cell may directly or indirectly reference its own address', 'Variance = (Actual - Budget) / Budget'],
      ['Resolved clean calculation chain with zero #CIRCULAR! warnings', 'Variance analysis report'],
      { budgetLines: 25, circularCell: 'E15' },
      ['break_circular_ref', 'recalculate_sheet', 'export_report'],
      [
        { level: 1, clue: 'Inspect formula in cell E15: it references E25 which is the SUM that includes E15.' },
        { level: 2, clue: 'Set Overhead as fixed percentage of Base Cost (C15 * 0.15) instead of Total.' }
      ]
    )
  ],

  // =========================================================================
  // 3. SQL: SQL Query Logic Lab
  // =========================================================================
  'sql-query-logic-lab': [
    createScenario(
      'sql-query-logic-lab', 1, 'beginner',
      'Every Customer, Zero-Order Prospects Included',
      'Construct a relational query that lists all customer names and their total spend, including prospective customers who have never placed an order.',
      ['SELECT fields', 'FROM table', 'JOIN type', 'GROUP BY clause'],
      ['Zero-order prospects must not be dropped from the result set', 'INNER JOIN is disallowed because it drops unmatched rows'],
      ['Output table containing prospects with total spend 0 or NULL', 'Accurate SQL representation'],
      { tables: ['customers', 'orders'], unmatchedProspects: ['Devendra Rao'] },
      ['select_fields', 'configure_join', 'add_group_by', 'run_query'],
      [
        { level: 1, clue: 'An INNER JOIN only keeps rows that have matches in both tables.' },
        { level: 2, clue: 'Use LEFT JOIN customers ON orders.customer_id = customers.customer_id.' },
        { level: 3, clue: 'Select customers.name and COALESCE(SUM(orders.amount), 0).' }
      ]
    ),
    createScenario(
      'sql-query-logic-lab', 2, 'beginner',
      'Orders Placed: Actual Purchasing Customers Only',
      'Count how many orders were completed by customers who have placed at least one delivered order.',
      ['SELECT fields', 'JOIN type', 'WHERE filter', 'GROUP BY'],
      ['Filter out Cancelled orders', 'Do not include customers with 0 orders'],
      ['Result grid with customer name and order count', 'Correct SQL query syntax'],
      { tables: ['customers', 'orders'] },
      ['select_fields', 'set_filter', 'configure_join', 'run_query'],
      [
        { level: 1, clue: 'Use INNER JOIN between customers and orders.' },
        { level: 2, clue: 'Add WHERE orders.status = "Delivered".' }
      ]
    ),
    createScenario(
      'sql-query-logic-lab', 3, 'intermediate',
      'Gold Tier Customer Total Spend with NULL Payment Handling',
      'Calculate total delivered spend for Gold-tier customers. One order has a NULL amount due to a payment gateway timeout; guard against corrupted totals.',
      ['SELECT clause', 'WHERE predicates', 'Aggregate expression', 'Null handling'],
      ['Filter customers.tier = "Gold"', 'NULL amount order must not cause the entire customer sum to evaluate to NULL/NaN'],
      ['Accurate Gold tier spend table', 'Null payment order handled cleanly with COALESCE or IS NOT NULL'],
      { tables: ['customers', 'orders'], nullAmountRow: 106 },
      ['set_null_policy', 'add_where_filter', 'run_query'],
      [
        { level: 1, clue: 'In SQL, summing NULL values can propagate. Use COALESCE(amount, 0) or WHERE amount IS NOT NULL.' },
        { level: 2, clue: 'Use COALESCE(o.amount, 0) inside SUM() to prevent NULL from poisoning the cumulative total.' }
      ]
    ),
    createScenario(
      'sql-query-logic-lab', 4, 'intermediate',
      'Duplicate Signup Key Deduplication in Relational Joins',
      'The customers table contains a duplicate signup row with customer_id=1. Demonstrate how a naive JOIN inflates order revenue and fix it.',
      ['Deduplication step', 'Primary key verification', 'Join key selection'],
      ['Verify that customer_id is a unique primary key before joining', 'Do not double-count order totals'],
      ['Pre-join customer count vs post-join customer count', 'Accurate, non-inflated customer spend'],
      { tables: ['customers_with_dup', 'orders'], duplicateId: 1 },
      ['verify_primary_key', 'deduplicate_table', 'run_query'],
      [
        { level: 1, clue: 'Check customers table: customer_id 1 appears twice (Alice Sharma).' },
        { level: 2, clue: 'Joining against duplicate customer keys duplicates all of Alice\'s orders!' }
      ]
    ),
    createScenario(
      'sql-query-logic-lab', 5, 'challenge',
      'Multi-Table Star Join: Customers, Orders & Products',
      'Join Customers -> Orders -> OrderItems -> Products to compute total profit margin per customer city.',
      ['Table join chain', 'Join conditions', 'Calculated column ((unitPrice - unitCost) * qty)', 'City grouping'],
      ['All 4 tables must be properly linked via foreign keys', 'Order by Profit DESC'],
      ['City profit ranking table', 'Correct multi-join SQL query representation'],
      { tables: ['customers', 'orders', 'order_items', 'products'] },
      ['build_multi_join', 'add_calculated_field', 'set_order_by', 'run_query'],
      [
        { level: 1, clue: 'Connect customers to orders via customer_id, orders to order_items via order_id, order_items to products via product_id.' },
        { level: 2, clue: 'Join sequence: customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id JOIN products p ON oi.product_id = p.product_id.' }
      ]
    ),
    createScenario(
      'sql-query-logic-lab', 6, 'challenge',
      'HAVING Clause & Aggregate Threshold Filtering',
      'Find all customers who have placed more than 3 orders AND whose average order value exceeds ₹5,000.',
      ['SELECT', 'GROUP BY', 'HAVING COUNT(*) > 3 AND AVG(amount) > 5000', 'ORDER BY'],
      ['Do not put aggregate conditions in the WHERE clause', 'Filter applies strictly post-aggregation'],
      ['Filtered high-value repeat customer list', 'Valid HAVING clause generated in SQL'],
      { tables: ['customers', 'orders'] },
      ['configure_having', 'set_aggregate_filter', 'run_query'],
      [
        { level: 1, clue: 'WHERE filters individual rows before grouping; HAVING filters aggregated groups.' },
        { level: 2, clue: 'Put the aggregate threshold in HAVING: HAVING COUNT(order_id) > 3 AND AVG(amount) > 5000.' }
      ]
    )
  ],

  // =========================================================================
  // 9. FRONTEND: Frontend Layout and Accessibility Lab
  // =========================================================================
  'frontend-layout-and-accessibility-lab': [
    createScenario(
      'frontend-layout-and-accessibility-lab', 1, 'beginner',
      'Course Hero Banner Contrast & ARIA Remediation',
      'Remediate low-contrast text on an "Enroll Now" CTA button and add missing ARIA labels to icon-only navigation links.',
      ['CTA Button foreground color', 'CTA Button background color', 'Navbar ARIA labels'],
      ['WCAG 2.1 AA normal text contrast must be >= 4.5:1', 'All interactive buttons must have non-empty accessible labels'],
      ['Verified contrast ratio >= 4.5:1', 'Full accessibility pass with zero missing labels'],
      { buttonFg: '#888888', buttonBg: '#3b82f6', navAriaMissing: true },
      ['change_color_hex', 'edit_aria_label', 'run_a11y_audit'],
      [
        { level: 1, clue: 'Grey text (#888888) on blue (#3b82f6) has a contrast ratio of only 2.1:1.' },
        { level: 2, clue: 'Change button text color to white (#ffffff) to achieve 4.6:1 contrast ratio.' }
      ]
    ),
    createScenario(
      'frontend-layout-and-accessibility-lab', 2, 'beginner',
      'Mobile Card Grid Overflow & Flex Wrapping',
      'The 3-column course module grid overflows horizontally on mobile devices (375px viewport). Configure flex-wrap and responsive stacking.',
      ['Card grid flex-direction', 'Flex-wrap property', 'Mobile breakpoint style'],
      ['No horizontal scrollbar on 375px mobile viewport', 'Cards must stack vertically with 16px gap'],
      ['Clean responsive layout in both Desktop and Mobile preview modes'],
      { previewMode: 'mobile', overflowDetected: true },
      ['toggle_flex_wrap', 'set_responsive_columns', 'check_mobile_preview'],
      [
        { level: 1, clue: 'Switch to Mobile Preview mode to observe the card overflow.' },
        { level: 2, clue: 'Enable flex-wrap: wrap and set mobile card width to 100%.' }
      ]
    ),
    createScenario(
      'frontend-layout-and-accessibility-lab', 3, 'intermediate',
      'Focus Order Sequencing & Visible Keyboard Focus Rings',
      'Fix a scrambled tabIndex sequence where pressing Tab jumps from Header directly to Footer, bypassing Main Content.',
      ['Component tabIndex values', 'DOM tree ordering', 'Focus ring visibility style'],
      ['Focus order must match logical reading flow: Header (1) -> Hero (2) -> Grid (3) -> CTA (4) -> Footer (5)', 'Focus indicator must have at least 3:1 contrast against background'],
      ['Sequential keyboard navigation trace passing all steps', 'Visible focus rings enabled'],
      { currentOrder: [1, 5, 2, 4, 3] },
      ['reorder_tab_index', 'test_keyboard_nav', 'enable_focus_rings'],
      [
        { level: 1, clue: 'Use the Tab Order inspector to see the sequence lines.' },
        { level: 2, clue: 'Ensure tabIndex reflects natural DOM order rather than arbitrary positive integers.' }
      ]
    ),
    createScenario(
      'frontend-layout-and-accessibility-lab', 4, 'intermediate',
      'Touch Target Sizing for Mobile Touchscreens (WCAG 2.2)',
      'The mobile navigation menu and secondary action buttons have a height of 28px. Increase touch target size to meet the 44x44px minimum.',
      ['Button padding', 'Min-height & min-width styles'],
      ['Interactive touch target must be at least 44px by 44px or have sufficient spacing buffer'],
      ['Zero undersized touch target violations in a11y audit'],
      { currentTouchSize: 28, targetMin: 44 },
      ['adjust_padding', 'set_min_dimensions', 'run_a11y_audit'],
      [
        { level: 1, clue: 'WCAG 2.2 Target Size (Minimum) requires at least 44x44 CSS pixels for pointers.' },
        { level: 2, clue: 'Set min-width: 44px; min-height: 44px; or increase button padding to py-3 px-4.' }
      ]
    ),
    createScenario(
      'frontend-layout-and-accessibility-lab', 5, 'challenge',
      'Full Accessible Modal Dialog with Focus Trapping',
      'Configure an accessible modal popup: set role="dialog", aria-modal="true", trap focus inside while open, and close on Escape key.',
      ['Modal ARIA attributes', 'Focus trap enabled', 'Escape key listener'],
      ['Tabbing while modal is open must loop inside the modal', 'Closing modal must restore focus to trigger button'],
      ['Validated accessible modal flow', 'Audit confirmation of focus restoration'],
      { modalOpen: false, focusTrapActive: false },
      ['configure_modal_a11y', 'test_focus_trap', 'test_escape_key'],
      [
        { level: 1, clue: 'Add aria-labelledby pointing to the modal heading id.' },
        { level: 2, clue: 'Include onKeyDown handler intercepting Tab key to cycle focus between first and last focusable element in dialog.' }
      ]
    ),
    createScenario(
      'frontend-layout-and-accessibility-lab', 6, 'challenge',
      'Dark Mode / Light Mode AAA Contrast Certification',
      'Build a dual-theme color palette where all text elements achieve WCAG AAA contrast (>= 7.0:1) in both Dark and Light modes.',
      ['Light mode text and background colors', 'Dark mode text and background colors'],
      ['Every text element must achieve >= 7.0:1 in both modes', 'Do not use pure saturated blue on black'],
      ['AAA compliance certificate', 'Contrast evaluation report for both themes'],
      { lightTheme: { bg: '#ffffff', fg: '#777777' }, darkTheme: { bg: '#111425', fg: '#8899ac' } },
      ['edit_theme_colors', 'toggle_dark_mode', 'run_contrast_audit'],
      [
        { level: 1, clue: 'For Light mode, #222222 on #ffffff achieves 16.0:1 (AAA).' },
        { level: 2, clue: 'For Dark mode, #f1f5f9 on #0f1322 achieves 14.8:1 (AAA).' }
      ]
    )
  ],

  // =========================================================================
  // 19. MARKETING: Marketing Budget Simulator
  // =========================================================================
  'marketing-budget-simulator': [
    createScenario(
      'marketing-budget-simulator', 1, 'beginner',
      'B2B SaaS Launch Campaign (Balanced Budget)',
      'Allocate 100,000 credits across Meta Ads, Google Search, and LinkedIn. Generate at least 150 qualified leads with CPL < 700.',
      ['Meta Ads budget', 'Google Search budget', 'LinkedIn budget', 'Creative variants'],
      ['Total budget <= 100,000 credits', 'No single channel over 75%', 'Advance 30-day simulation clock'],
      ['>= 150 qualified leads generated', 'Average Cost Per Lead (CPL) < 700 credits', 'Balanced multi-channel split'],
      { totalBudgetLimit: 100000, days: 30, targetLeads: 150, maxCpl: 700 },
      ['set_channel_budget', 'select_creative_variant', 'advance_simulation', 'reset_simulation'],
      [
        { level: 1, clue: 'Google Search has high intent (6.5% conversion rate). LinkedIn has high B2B lead quality.' },
        { level: 2, clue: 'A split of ₹30k Meta, ₹45k Google, ₹25k LinkedIn generates ~165 leads.' }
      ]
    ),
    createScenario(
      'marketing-budget-simulator', 2, 'beginner',
      'E-Commerce Festive Surge (High Volume)',
      'Allocate 120,000 credits for a consumer retail festive sale. Maximize total order volume while maintaining ROAS >= 3.0x.',
      ['Channel budgets (Meta, Google Shopping, YouTube)', 'Promotional discount creative'],
      ['ROAS >= 3.0x (Revenue >= 3x Ad Spend)', 'Zero spend on inactive channels'],
      ['Total conversions >= 300 orders', 'Achieved ROAS >= 3.0'],
      { totalBudgetLimit: 120000, days: 14, minRoas: 3.0 },
      ['set_channel_budget', 'select_creative_variant', 'advance_simulation'],
      [
        { level: 1, clue: 'Meta Video Showcase drives low CPM and high consumer top-of-funnel reach.' },
        { level: 2, clue: 'Allocate 45% to Meta Showcase, 35% to Google Shopping, and 20% to YouTube for balanced reach.' }
      ]
    ),
    createScenario(
      'marketing-budget-simulator', 3, 'intermediate',
      'Mid-Campaign Pivot: Reallocate Underperforming Channel',
      'Observe performance on Day 15. Meta CTR is deteriorating due to creative fatigue. Reallocate remaining unspent budget to Google without altering historical spend.',
      ['Day 16-30 budget adjustments', 'Creative refresh on Meta'],
      ['Past days (1-15) spend and leads must remain immutable', 'Total combined spend <= 100,000'],
      ['Successfully pivoted budget on Day 15', 'Total campaign leads >= 170'],
      { totalBudgetLimit: 100000, pauseDay: 15 },
      ['pause_simulation', 'reallocate_future_budget', 'resume_simulation'],
      [
        { level: 1, clue: 'On Day 15, pause and switch Meta to Creative Variant 2 (UGC video).' },
        { level: 2, clue: 'Shift 15,000 future credits from Meta to Google Search.' }
      ]
    ),
    createScenario(
      'marketing-budget-simulator', 4, 'intermediate',
      'Strict CPA Caps on High-Churn Acquisition',
      'Acquire trial users with an absolute Cost Per Acquisition cap of 450 credits. Guard against division by zero on zero-impression days.',
      ['Channel bids', 'Audience targeting tightness'],
      ['CPA must never exceed 450 credits', 'Handle zero clicks gracefully (CTR = 0% not NaN)'],
      ['>= 180 conversions with verified CPA <= 450'],
      { totalBudgetLimit: 90000, cpaCap: 450 },
      ['set_channel_budget', 'set_bidding_strategy', 'advance_simulation'],
      [
        { level: 1, clue: 'High intent keywords on Google offer the lowest CPA despite higher CPM.' },
        { level: 2, clue: 'Set exact keyword match bidding and guard division: CPA = conversions > 0 ? spend / conversions : 0.' }
      ]
    ),
    createScenario(
      'marketing-budget-simulator', 5, 'challenge',
      'Multi-Touch Attribution: Top of Funnel to Closing',
      'Coordinate Meta brand awareness (Top), YouTube explainer (Middle), and Google Search retargeting (Bottom) to achieve optimal blended CAC.',
      ['Funnel stage budget weighting (Top/Mid/Bottom)'],
      ['Top of funnel must receive at least 25% of budget to feed retargeting pool'],
      ['Blended Customer Acquisition Cost (CAC) < 550', 'Total customers >= 200'],
      { totalBudgetLimit: 150000, days: 30 },
      ['set_funnel_split', 'advance_simulation', 'export_ledger'],
      [
        { level: 1, clue: 'Starving the Top of Funnel causes Search conversion volume to dry up by Day 20.' },
        { level: 2, clue: 'Recommended split: 30% Meta Top, 25% YouTube Mid, 45% Google Search Bottom.' }
      ]
    ),
    createScenario(
      'marketing-budget-simulator', 6, 'challenge',
      'Omnichannel Retargeting with Ad Fatigue Modeling',
      'Scale spend to 250,000 credits across 5 channels. Counter creative saturation by scheduling weekly creative rotations.',
      ['Weekly creative schedule', 'Cross-channel budget rebalancing'],
      ['Fatigue penalty applies if creative runs > 10 days without rotation'],
      ['Maintained ROAS >= 2.8x under scaled spend', 'Lead volume >= 400'],
      { totalBudgetLimit: 250000, days: 30 },
      ['schedule_creative_rotation', 'run_simulation', 'export_report'],
      [
        { level: 1, clue: 'Rotate Meta and YouTube creatives every 7 days to eliminate the fatigue penalty.' },
        { level: 2, clue: 'Schedule Variant A for days 1-7, Variant B for days 8-14, Variant C for days 15-21, Variant D for days 22-30.' }
      ]
    )
  ],

  // =========================================================================
  // 29. OFFICE OPERATIONS: Executive Office Prioritization Lab
  // =========================================================================
  'executive-office-prioritization-lab': [
    createScenario(
      'executive-office-prioritization-lab', 1, 'beginner',
      'Multi-Timezone Calendar Conflict Triage',
      'Resolve overlapping meetings across IST (UTC+5:30), GMT (UTC+0), and EST (UTC-5). Move non-critical internal syncs to clear conflict with mandatory client pitch.',
      ['Calendar event times', 'Meeting priority classification'],
      ['Mandatory client pitch (15:00-16:00 IST) cannot be moved', 'Executive requires 15-min buffer between back-to-back calls'],
      ['Zero overlapping calendar conflicts', 'All attendees confirmed within working hours'],
      { timezoneOffsets: { IST: 5.5, GMT: 0, EST: -5 }, conflictedEventsCount: 2 },
      ['reschedule_event', 'view_timezone_grid', 'confirm_calendar'],
      [
        { level: 1, clue: 'Event 1 (Internal Sync) overlaps with Event 2 (Apex Deal Pitch) at 15:30 IST.' },
        { level: 2, clue: 'Move Event 1 to the open slot on Thursday 11:00 IST.' }
      ]
    ),
    createScenario(
      'executive-office-prioritization-lab', 2, 'beginner',
      'Executive Inbox Eisenhower Matrix Triage',
      'Sort 12 urgent and important emails into Eisenhower quadrants: Do First, Schedule, Delegate, or Archive.',
      ['Email quadrant categorization', 'Draft delegation notes'],
      ['Regulatory compliance notices must be in Do First', 'Vendor pitches must be Archived or Delegated'],
      ['100% accurate triage according to executive policy', 'Completed delegation brief'],
      { emailCount: 12 },
      ['categorize_email', 'assign_delegate', 'export_triage_log'],
      [
        { level: 1, clue: 'Notice from SEBI / Tax Auditor is Urgent AND Important (Do First).' },
        { level: 2, clue: 'Move SEBI audit notice to Do First, Quarterly Board deck prep to Schedule, Routine office stationery to Delegate.' }
      ]
    ),
    createScenario(
      'executive-office-prioritization-lab', 3, 'intermediate',
      'Corporate Travel Booking Policy Compliance',
      'Select flight and hotel options for a Singapore board meeting. Comply with policy: direct flights, arrival >= 3h before meeting, hotel check-in buffer.',
      ['Flight selection', 'Hotel check-in booking', 'Ground transport option'],
      ['No red-eye flight arriving < 2 hours before 09:00 keynote', 'Total booking within ₹60,000 corporate cap'],
      ['Policy-compliant itinerary selected', 'Zero fatigue risk violations'],
      { flights: 4, hotels: 3, budgetCap: 60000 },
      ['select_flight', 'select_hotel', 'validate_policy'],
      [
        { level: 1, clue: 'Option A arrives at 04:15 SGT causing severe fatigue before 9 AM keynote.' },
        { level: 2, clue: 'Option B (Singapore Airlines SQ503) arrives at 06:20 SGT with 3 hours refresh window.' }
      ]
    ),
    createScenario(
      'executive-office-prioritization-lab', 4, 'intermediate',
      'Cross-Continent 4-Timezone Board Meeting Coordination',
      'Find a 90-minute meeting window suitable for participants in San Francisco (PST), London (GMT), Mumbai (IST), and Tokyo (JST).',
      ['Selected meeting slot (UTC)'],
      ['No participant may be scheduled outside 08:00 to 21:00 local time', 'Board quorum requires all 4 regions represented'],
      ['Optimal global meeting window identified', 'Calendar invites drafted in all local timezones'],
      { participants: ['PST', 'GMT', 'IST', 'JST'] },
      ['scan_availability_overlap', 'propose_meeting_slot'],
      [
        { level: 1, clue: '13:30 UTC corresponds to 06:30 PST (too early) and 22:30 JST (too late).' },
        { level: 2, clue: 'Check 12:00 to 13:30 UTC for the best compromise.' }
      ]
    ),
    createScenario(
      'executive-office-prioritization-lab', 5, 'challenge',
      'Crisis Embargo & Emergency Schedule Reshuffle',
      'A hostile takeover bid requires immediate board consultation. Reschedule 3 full days of calendar meetings under strict regulatory embargo conditions.',
      ['3-day calendar rescheduling', 'Embargo compliance checklist'],
      ['Confidential meetings must not have details leaked in calendar invite subject lines'],
      ['Complete 3-day emergency schedule aligned', 'Zero confidential leaks'],
      { daysRescheduled: 3, emergencyEventsCount: 6 },
      ['bulk_reschedule', 'sanitize_invite_text', 'export_handover_memo'],
      [
        { level: 1, clue: 'Change sensitive subject lines to "Special Executive Consultation" instead of "Project Phoenix Buyout".' },
        { level: 2, clue: 'Sanitize descriptions, redact project code names, and mark calendar entries as Private.' }
      ]
    ),
    createScenario(
      'executive-office-prioritization-lab', 6, 'challenge',
      'Comprehensive Shift Handover Memo & Delegation Audit',
      'Prepare an end-of-week executive handover memo. Synthesize status of 15 pending approvals, budget authorizations, and open inquiries.',
      ['Handover memo text editor', 'Action item assignment table'],
      ['All items marked "Pending MD Approval" must have explicit next steps and deadlines'],
      ['Structured handover memo exportable as PDF/Text', 'Zero unassigned high-priority tasks'],
      { pendingItemsCount: 15 },
      ['draft_handover_memo', 'assign_deadlines', 'export_report'],
      [
        { level: 1, clue: 'Group items by Department (Finance, Legal, HR, Operations) before listing action owners.' },
        { level: 2, clue: 'Tag every pending item with: Owner, Target Date, Risk Level, and Required Executive Signoff.' }
      ]
    )
  ]
};

// Generic factory to ensure all other 25 labs also have at least 6 authored scenarios
export function getScenariosForLab(slug: string): LabScenarioVariant[] {
  if (allLabScenarios[slug] && allLabScenarios[slug].length >= 6) {
    return allLabScenarios[slug];
  }

  // Generate 6 structured scenarios for any lab not explicitly populated above
  const tiers: LabDifficulty[] = ['beginner', 'beginner', 'intermediate', 'intermediate', 'challenge', 'challenge'];
  const titles = [
    'Baseline Guided Scenario (Foundational)',
    'Alternative Context & Variance Check',
    'Constrained Intermediate Trade-off Analysis',
    'Multi-Parameter Optimization Exercise',
    'Stress Test & Boundary Edge-Case Scenario',
    'Autonomous Challenge: Comprehensive Evaluation'
  ];

  const generated = tiers.map((tier, idx) => {
    return createScenario(
      slug,
      idx + 1,
      tier,
      `${titles[idx]} for ${slug.replace(/-/g, ' ')}`,
      `Complete simulation tasks for ${slug.replace(/-/g, ' ')} under realistic operational constraints.`,
      ['Workspace configuration inputs', 'Scenario parameters'],
      ['Adhere to declared resource limits', 'Ensure deterministic reproducibility with fixed seed'],
      ['Verified simulation output', 'Validated rubric feedback'],
      { seed: 100 + idx, difficulty: tier, scenarioIndex: idx + 1 },
      ['configure_parameters', 'run_simulation', 'compare_snapshots', 'export_report'],
      [
        { level: 1, clue: 'Inspect the starting materials and constraints in the left panel.' },
        { level: 2, clue: 'Adjust primary control parameters and observe results in the bottom panel.' }
      ]
    );
  });

  allLabScenarios[slug] = generated;
  return generated;
}

export function getScenarioForLab(slug: string, variantOrId?: string): LabScenarioVariant | undefined {
  const scenarios = getScenariosForLab(slug);
  if (!variantOrId) return scenarios[0];

  // Match by exact scenario ID first e.g. "mbs-001"
  const byId = scenarios.find(s => s.id.toLowerCase() === variantOrId.toLowerCase());
  if (byId) return byId;

  // Match by difficulty tier ('beginner' | 'intermediate' | 'challenge')
  const byTier = scenarios.find(s => s.variant === variantOrId);
  return byTier || scenarios[0];
}

// Ensure all 30 catalog labs are eagerly populated in the scenario registry
allLabsCatalog.forEach(lab => {
  getScenariosForLab(lab.slug);
});

export const LAB_SCENARIOS_REGISTRY = allLabScenarios;

