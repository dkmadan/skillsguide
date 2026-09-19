'use client';

import React, { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import BreakdownDoughnutChart from '@/components/labs/charts/BreakdownDoughnutChart';
import SimClock from '@/components/labs/SimClock';
import {
  Terminal, Bug, CheckCircle2, RotateCcw, Send, Sparkles, ArrowRight,
  Undo2, Redo2, ListOrdered, ArrowUp, ArrowDown, Download, FileJson, Workflow,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

type Category = 'loops' | 'lists' | 'conditions' | 'dictionaries' | 'functions' | 'errors';

interface TraceFrame { line: number; note: string; vars: Record<string, string>; }
interface ChoiceOption { id: string; label: string; sublabel?: string; }

interface PredictExercise {
  kind: 'predict';
  choices: ChoiceOption[];
  answerKey: string;
  trace: TraceFrame[];
  explanation: string;
}
interface OrderExercise {
  kind: 'order';
  chunks: { id: string; text: string }[];
  correctOrder: string[];
  successTrace: TraceFrame[];
  altOutcomes: { orderKey: string; note: string; trace: TraceFrame[] }[];
  explanation: string;
}
interface CorrectionExercise {
  kind: 'correction';
  bugChoices?: ChoiceOption[];
  bugAnswerKey?: string;
  choices: ChoiceOption[];
  answerKey: string;
  tracesByChoice: Record<string, TraceFrame[]>;
  explanation: string;
}
type Exercise = PredictExercise | OrderExercise | CorrectionExercise;

interface Snippet {
  id: string;
  category: Category;
  title: string;
  code: string[];
  prompt: string;
  exercise: Exercise;
}

function buildSnippets(variant: LabDifficulty): Snippet[] {
  if (variant === 'beginner') {
    return [
      {
        id: 'sn-loops', category: 'loops', title: 'Loop Accumulator',
        code: ['rows = ["Acme Corp", "Beta LLC", "Gamma Inc", "Delta Co"]', 'total_chars = 0', 'for i in range(len(rows)):', '    total_chars += len(rows[i])'],
        prompt: 'Predict the final value of total_chars after the loop completes.',
        exercise: {
          kind: 'predict',
          choices: [{ id: 'c34', label: '34' }, { id: 'c30', label: '30' }, { id: 'c26', label: '26' }, { id: 'c38', label: '38' }],
          answerKey: 'c34',
          trace: [
            { line: 2, note: 'Initialize accumulator', vars: { total_chars: '0', i: 'undefined' } },
            { line: 4, note: 'i=0: "Acme Corp" has 9 chars', vars: { total_chars: '9', i: '0' } },
            { line: 4, note: 'i=1: "Beta LLC" has 8 chars', vars: { total_chars: '17', i: '1' } },
            { line: 4, note: 'i=2: "Gamma Inc" has 9 chars', vars: { total_chars: '26', i: '2' } },
            { line: 4, note: 'i=3: "Delta Co" has 8 chars — loop ends (range(len(rows)) is correct, no bug here)', vars: { total_chars: '34', i: '3' } },
          ],
          explanation: 'range(len(rows)) visits indices 0..3 exactly once each — 9+8+9+8 = 34. This snippet has no bug; it exists to build accurate variable-tracing habits before hunting for defects.',
        },
      },
      {
        id: 'sn-lists', category: 'lists', title: 'Order the De-duplication Routine',
        code: ['raw_names = ["Nova", "Vertex", "Nova", "Delta"]', '<your arrangement goes here>'],
        prompt: 'Arrange the four statement blocks so the routine builds a de-duplicated list that preserves first-seen order.',
        exercise: {
          kind: 'order',
          chunks: [
            { id: 'A', text: 'seen = set()\nresult = []' },
            { id: 'B', text: 'for name in raw_names:' },
            { id: 'C', text: '    if name not in seen:' },
            { id: 'D', text: '        seen.add(name)\n        result.append(name)' },
          ],
          correctOrder: ['A', 'B', 'C', 'D'],
          successTrace: [
            { line: 1, note: 'seen and result initialized empty', vars: { seen: '{}', result: '[]' } },
            { line: 2, note: 'name="Nova" not seen — keep it', vars: { seen: '{Nova}', result: '[Nova]' } },
            { line: 2, note: 'name="Vertex" not seen — keep it', vars: { seen: '{Nova,Vertex}', result: '[Nova,Vertex]' } },
            { line: 2, note: 'name="Nova" already seen — skipped', vars: { seen: '{Nova,Vertex}', result: '[Nova,Vertex]' } },
            { line: 2, note: 'name="Delta" not seen — keep it. Loop ends.', vars: { seen: '{Nova,Vertex,Delta}', result: '[Nova,Vertex,Delta]' } },
          ],
          altOutcomes: [
            { orderKey: 'D,C,B,A', note: 'seen/result referenced before they are defined.', trace: [{ line: 1, note: 'NameError: name \'seen\' is not defined (block D runs before block A)', vars: { seen: 'undefined', result: 'undefined' } }] },
            { orderKey: 'A,C,B,D', note: 'the if-check sits outside any loop.', trace: [{ line: 1, note: 'NameError: name \'name\' is not defined — block C references the loop variable before block B creates the loop', vars: { seen: '{}', result: '[]' } }] },
            { orderKey: 'A,B,D,C', note: 'append runs unconditionally before the duplicate check.', trace: [
              { line: 1, note: 'Every name is appended before the if-check ever runs', vars: { seen: '{}', result: '[]' } },
              { line: 2, note: 'Loop completes — duplicates were never filtered', vars: { seen: '{Nova,Vertex,Delta}', result: '[Nova,Vertex,Nova,Delta]' } },
            ] },
          ],
          explanation: 'seen/result must exist before the loop (A), the loop must wrap the check (B before C), and the check must gate the mutation (C before D). Any other order either crashes or silently keeps duplicates.',
        },
      },
      {
        id: 'sn-conditions', category: 'conditions', title: 'Grade Boundary Branching',
        code: ['score = 72', 'if score >= 90:', '    grade = "A"', 'elif score >= 75:', '    grade = "B"', 'elif score >= 60:', '    grade = "C"', 'else:', '    grade = "D"'],
        prompt: 'Predict the final value of grade for score = 72.',
        exercise: {
          kind: 'predict',
          choices: [{ id: 'gc', label: '"C"' }, { id: 'gb', label: '"B"' }, { id: 'gd', label: '"D"' }, { id: 'ga', label: '"A"' }],
          answerKey: 'gc',
          trace: [
            { line: 2, note: '72 >= 90 is False', vars: { score: '72', grade: 'undefined' } },
            { line: 4, note: '72 >= 75 is False', vars: { score: '72', grade: 'undefined' } },
            { line: 6, note: '72 >= 60 is True — branch taken', vars: { score: '72', grade: '"C"' } },
          ],
          explanation: 'Python elif chains evaluate top-to-bottom and stop at the first True condition. 72 fails the first two thresholds and satisfies the third, so grade = "C".',
        },
      },
      {
        id: 'sn-dicts', category: 'dictionaries', title: 'Dictionary Default Lookup',
        code: ['inventory = {"pens": 12, "notebooks": 5}', 'count = inventory.get("staplers", 0)', 'inventory["staplers"] = count + 3'],
        prompt: 'Predict the final value of inventory["staplers"].',
        exercise: {
          kind: 'predict',
          choices: [{ id: 'd3', label: '3' }, { id: 'd0', label: '0' }, { id: 'd8', label: '8' }, { id: 'derr', label: 'KeyError' }],
          answerKey: 'd3',
          trace: [
            { line: 1, note: 'inventory has no "staplers" key yet', vars: { inventory: '{pens:12,notebooks:5}' } },
            { line: 2, note: '.get returns the default 0 — no exception raised', vars: { count: '0' } },
            { line: 3, note: 'staplers is set to 0 + 3', vars: { 'inventory["staplers"]': '3' } },
          ],
          explanation: 'dict.get(key, default) never raises KeyError — it returns the supplied default when the key is absent, so count starts at 0 and staplers ends at 3.',
        },
      },
      {
        id: 'sn-functions', category: 'functions', title: 'CSV Row Cleaner (Off-By-One)',
        code: ['def clean_rows(rows):', '    cleaned = []', '    for i in range(len(rows) + 1):', '        cleaned.append(rows[i].strip())', '    return cleaned'],
        prompt: 'Diagnose the defect, then select the loop bound that fixes it (rows has 4 elements).',
        exercise: {
          kind: 'correction',
          bugChoices: [{ id: 'off_by_one', label: 'Off-by-one index boundary' }, { id: 'type_error', label: 'TypeError on strip()' }, { id: 'name_error', label: 'NameError on rows' }],
          bugAnswerKey: 'off_by_one',
          choices: [
            { id: 'range_len', label: 'range(len(rows))', sublabel: 'Correct — stops at len-1' },
            { id: 'range_len_plus_one', label: 'range(len(rows) + 1)', sublabel: 'Original — crashes' },
            { id: 'range_one_to_len_plus_one', label: 'range(1, len(rows) + 1)', sublabel: 'Skips row 0, still crashes' },
          ],
          answerKey: 'range_len',
          tracesByChoice: {
            range_len: [
              { line: 3, note: 'i takes 0,1,2,3 — exactly the 4 valid indices', vars: { i: '0..3', cleaned: '[]' } },
              { line: 4, note: 'All four rows appended cleanly', vars: { cleaned: '[4 items]' } },
              { line: 5, note: 'Function returns without error', vars: { result: 'cleaned (len 4)' } },
            ],
            range_len_plus_one: [
              { line: 3, note: 'i takes 0,1,2,3,4 — one too many', vars: { i: '0..4' } },
              { line: 4, note: 'i=4 accesses rows[4], which does not exist', vars: { cleaned: '[4 items]', i: '4' } },
              { line: 4, note: 'IndexError: list index out of range', vars: { error: 'IndexError' } },
            ],
            range_one_to_len_plus_one: [
              { line: 3, note: 'i takes 1,2,3,4 — row 0 is never processed', vars: { i: '1..4', cleaned: '[]' } },
              { line: 4, note: 'i=1..3 append rows[1..3] — first row silently dropped', vars: { cleaned: '[3 items, missing row 0]' } },
              { line: 4, note: 'i=4 accesses rows[4] — IndexError anyway', vars: { error: 'IndexError' } },
            ],
          },
          explanation: 'range(len(rows)) is the only bound that visits indices 0..len-1 with no gaps and no overrun. Shifting the start to 1 does not fix the overrun — it adds a second defect (dropping row 0) on top of it.',
        },
      },
      {
        id: 'sn-errors', category: 'errors', title: 'Catalog Lookup Exception Handling',
        code: ['def get_price(catalog, sku):', '    try:', '        return catalog[sku]', '    except ???:', '        return None', '', 'price = get_price(catalog, "SKU-999")  # SKU-999 is missing'],
        prompt: 'Choose the exception clause that safely handles a missing SKU.',
        exercise: {
          kind: 'correction',
          choices: [
            { id: 'except_keyerror', label: 'except KeyError:', sublabel: 'Correct — matches dict lookup failure' },
            { id: 'except_indexerror', label: 'except IndexError:', sublabel: 'Wrong exception type' },
            { id: 'except_bare', label: 'except:', sublabel: 'Catches everything silently' },
          ],
          answerKey: 'except_keyerror',
          tracesByChoice: {
            except_keyerror: [
              { line: 3, note: 'catalog["SKU-999"] raises KeyError', vars: { sku: 'SKU-999' } },
              { line: 4, note: 'except KeyError matches — handled', vars: { result: 'None' } },
            ],
            except_indexerror: [
              { line: 3, note: 'catalog["SKU-999"] raises KeyError', vars: { sku: 'SKU-999' } },
              { line: 4, note: 'except IndexError does not match KeyError — unhandled', vars: { error: 'KeyError (uncaught)' } },
            ],
            except_bare: [
              { line: 3, note: 'catalog["SKU-999"] raises KeyError', vars: { sku: 'SKU-999' } },
              { line: 4, note: 'bare except catches it — no crash, but also silently hides unrelated bugs (e.g. a typo\'d variable name)', vars: { result: 'None (unsafe pattern)' } },
            ],
          },
          explanation: 'Dictionary key lookups raise KeyError, never IndexError. A bare except technically avoids the crash here, but it is flagged as unsafe because it would also swallow unrelated programming mistakes.',
        },
      },
    ];
  }

  if (variant === 'intermediate') {
    return [
      {
        id: 'sn-loops', category: 'loops', title: 'Whitespace-Aware Accumulator',
        code: ['rows = [" Orion Labs ", "Zed Systems", " Quill Data"]', 'total_len = 0', 'for row in rows:', '    total_len += len(row.strip())'],
        prompt: 'Predict the final value of total_len.',
        exercise: {
          kind: 'predict',
          choices: [{ id: 'c31', label: '31' }, { id: 'c34', label: '34 (no strip)' }, { id: 'c29', label: '29' }, { id: 'c33', label: '33' }],
          answerKey: 'c31',
          trace: [
            { line: 4, note: '"Orion Labs" (stripped) = 10 chars', vars: { total_len: '10' } },
            { line: 4, note: '"Zed Systems" = 11 chars', vars: { total_len: '21' } },
            { line: 4, note: '"Quill Data" (stripped) = 10 chars', vars: { total_len: '31' } },
          ],
          explanation: '.strip() removes leading/trailing whitespace before len() counts characters, so the padded raw strings measure 10+11+10 = 31, not their untrimmed lengths.',
        },
      },
      {
        id: 'sn-lists', category: 'lists', title: 'Case-Insensitive De-duplication',
        code: ['raw_names = ["Nova", "vertex", "NOVA", "Delta"]', '<your arrangement goes here>'],
        prompt: 'Arrange the five blocks so duplicates are detected case-insensitively while original casing is preserved in the output.',
        exercise: {
          kind: 'order',
          chunks: [
            { id: 'A', text: 'seen = set()\nresult = []' },
            { id: 'B', text: 'for name in raw_names:' },
            { id: 'C', text: '    key = name.lower()' },
            { id: 'D', text: '    if key not in seen:' },
            { id: 'E', text: '        seen.add(key)\n        result.append(name)' },
          ],
          correctOrder: ['A', 'B', 'C', 'D', 'E'],
          successTrace: [
            { line: 1, note: 'seen/result initialized', vars: { seen: '{}', result: '[]' } },
            { line: 3, note: '"Nova" -> key "nova", unseen — kept', vars: { seen: '{nova}', result: '[Nova]' } },
            { line: 3, note: '"vertex" -> key "vertex", unseen — kept', vars: { seen: '{nova,vertex}', result: '[Nova,vertex]' } },
            { line: 3, note: '"NOVA" -> key "nova", already seen — skipped', vars: { result: '[Nova,vertex]' } },
            { line: 3, note: '"Delta" -> key "delta", unseen — kept. Loop ends.', vars: { result: '[Nova,vertex,Delta]' } },
          ],
          altOutcomes: [
            { orderKey: 'A,B,D,C,E', note: 'the if-check runs before key is computed.', trace: [{ line: 1, note: 'NameError: name \'key\' is not defined — block D reads key before block C creates it', vars: {} }] },
            { orderKey: 'A,C,B,D,E', note: 'key computed before the loop variable exists.', trace: [{ line: 1, note: 'NameError: name \'name\' is not defined — block C runs before block B', vars: {} }] },
          ],
          explanation: 'Each statement depends on the one before it: the loop variable (B) must exist before key can be derived (C), and key must exist before the membership check (D) can run.',
        },
      },
      {
        id: 'sn-conditions', category: 'conditions', title: 'Falsy Short-Circuit',
        code: ['tags = []', 'priority = "urgent" if tags and "vip" in tags else "standard"'],
        prompt: 'Predict the final value of priority.',
        exercise: {
          kind: 'predict',
          choices: [{ id: 'pstd', label: '"standard"' }, { id: 'purg', label: '"urgent"' }, { id: 'pvip', label: '"vip"' }, { id: 'perr', label: 'TypeError' }],
          answerKey: 'pstd',
          trace: [
            { line: 1, note: 'tags is an empty list — falsy', vars: { tags: '[]' } },
            { line: 2, note: '`tags and ...` short-circuits on the falsy left operand without evaluating "vip" in tags', vars: { 'tags and ...': '[] (falsy)' } },
            { line: 2, note: 'The conditional expression evaluates to the else branch', vars: { priority: '"standard"' } },
          ],
          explanation: 'Python\'s `and` short-circuits: an empty list is falsy, so the whole `tags and "vip" in tags` expression is falsy without ever checking membership, and the ternary falls to "standard".',
        },
      },
      {
        id: 'sn-dicts', category: 'dictionaries', title: 'Duplicate Literal Keys',
        code: ['scores = {"alice": 88, "bob": 91, "alice": 95}'],
        prompt: 'Predict the final value of scores["alice"].',
        exercise: {
          kind: 'predict',
          choices: [{ id: 'd95', label: '95' }, { id: 'd88', label: '88' }, { id: 'd183', label: '183' }, { id: 'derr', label: 'SyntaxError' }],
          answerKey: 'd95',
          trace: [
            { line: 1, note: 'Dict literal assigns "alice": 88 first', vars: { scores: '{alice:88}' } },
            { line: 1, note: 'Then assigns "bob": 91', vars: { scores: '{alice:88,bob:91}' } },
            { line: 1, note: 'The second "alice": 95 overwrites the first — no error, last write wins', vars: { scores: '{alice:95,bob:91}' } },
          ],
          explanation: 'A dict literal silently keeps only the last value for a repeated key — Python does not raise an error, so scores["alice"] ends at 95.',
        },
      },
      {
        id: 'sn-functions', category: 'functions', title: 'Trailing-Window Slicer',
        code: ['def get_last_n(rows, n):', '    result = []', '    for i in range(len(rows) - n, len(rows) + 1):', '        result.append(rows[i])', '    return result', '# called with rows of length 5, n = 2'],
        prompt: 'Diagnose the defect, then select the range bound that fixes it.',
        exercise: {
          kind: 'correction',
          bugChoices: [{ id: 'off_by_one', label: 'Off-by-one on the upper bound' }, { id: 'off_by_one_lower', label: 'Off-by-one on the lower bound' }, { id: 'type_error', label: 'TypeError on subtraction' }],
          bugAnswerKey: 'off_by_one',
          choices: [
            { id: 'fixed', label: 'range(len(rows) - n, len(rows))', sublabel: 'Correct — 2 elements, in bounds' },
            { id: 'original', label: 'range(len(rows) - n, len(rows) + 1)', sublabel: 'Original — crashes' },
            { id: 'shifted', label: 'range(len(rows) - n - 1, len(rows) + 1)', sublabel: 'Both bounds wrong' },
          ],
          answerKey: 'fixed',
          tracesByChoice: {
            fixed: [
              { line: 3, note: 'i takes 3,4 — exactly the last 2 valid indices', vars: { i: '3,4' } },
              { line: 4, note: 'rows[3], rows[4] both valid', vars: { result: '[2 items]' } },
            ],
            original: [
              { line: 3, note: 'i takes 3,4,5 — one too many', vars: { i: '3,4,5' } },
              { line: 4, note: 'rows[5] is out of range', vars: { error: 'IndexError' } },
            ],
            shifted: [
              { line: 3, note: 'i takes 2,3,4,5 — wrong window size and still overruns', vars: { i: '2,3,4,5' } },
              { line: 4, note: 'rows[5] is out of range', vars: { error: 'IndexError' } },
            ],
          },
          explanation: 'The last n valid indices of a list of length L are L-n .. L-1, which is exactly range(L-n, L). Adding +1 to the stop value (or shifting the start) both overrun the list.',
        },
      },
      {
        id: 'sn-errors', category: 'errors', title: 'Multi-Exception Division Guard',
        code: ['def safe_divide(values, i, j):', '    try:', '        return values[i] / values[j]', '    except ???:', '        return None', '# called where values[j] == 0'],
        prompt: 'Choose the exception clause that most robustly handles this function.',
        exercise: {
          kind: 'correction',
          choices: [
            { id: 'both', label: 'except (IndexError, ZeroDivisionError):', sublabel: 'Correct — covers both failure modes' },
            { id: 'zero_only', label: 'except ZeroDivisionError:', sublabel: 'Misses out-of-range indices' },
            { id: 'reraise', label: 'except Exception: raise', sublabel: 'Never actually handles anything' },
          ],
          answerKey: 'both',
          tracesByChoice: {
            both: [
              { line: 3, note: 'values[j] == 0 raises ZeroDivisionError', vars: {} },
              { line: 4, note: 'Tuple except matches ZeroDivisionError — handled', vars: { result: 'None' } },
            ],
            zero_only: [
              { line: 3, note: 'values[j] == 0 raises ZeroDivisionError', vars: {} },
              { line: 4, note: 'except ZeroDivisionError matches this run — handled, but an out-of-range i or j would still crash unhandled', vars: { result: 'None (incomplete coverage)' } },
            ],
            reraise: [
              { line: 3, note: 'values[j] == 0 raises ZeroDivisionError', vars: {} },
              { line: 4, note: 'except Exception: raise re-throws immediately — the function still crashes', vars: { error: 'ZeroDivisionError (uncaught)' } },
            ],
          },
          explanation: 'This function can fail two different ways (bad index or divide-by-zero). Only the tuple except clause covers both; the others either miss a failure mode or defeat the purpose of the try block entirely.',
        },
      },
    ];
  }

  // challenge
  return [
    {
      id: 'sn-loops', category: 'loops', title: 'Offset Enumerate Filter',
      code: ['rows = ["a1", "b2", "c3", "d4", "e5", "f6"]', 'kept = []', 'for idx, val in enumerate(rows, start=1):', '    if idx % 2 == 0:', '        kept.append(val)'],
      prompt: 'Predict the final contents of kept.',
      exercise: {
        kind: 'predict',
        choices: [{ id: 'k1', label: '["b2","d4","f6"]' }, { id: 'k2', label: '["a1","c3","e5"]' }, { id: 'k3', label: '["a1","b2","c3"]' }, { id: 'k4', label: '["d4","e5","f6"]' }],
        answerKey: 'k1',
        trace: [
          { line: 3, note: 'enumerate(rows, start=1): idx runs 1..6, val runs rows[0..5] in lockstep', vars: { idx: '1..6' } },
          { line: 4, note: 'idx=1 ("a1") odd — skipped; idx=2 ("b2") even — kept', vars: { kept: '[b2]' } },
          { line: 4, note: 'idx=3 ("c3") odd — skipped; idx=4 ("d4") even — kept', vars: { kept: '[b2,d4]' } },
          { line: 4, note: 'idx=5 ("e5") odd — skipped; idx=6 ("f6") even — kept', vars: { kept: '[b2,d4,f6]' } },
        ],
        explanation: 'start=1 offsets idx by one relative to the list position, so the even-idx filter actually keeps rows[1], rows[3], rows[5] ("b2","d4","f6") — the odd-position elements, not the even ones.',
      },
    },
    {
      id: 'sn-lists', category: 'lists', title: 'Indexed Lookup Table Merge',
      code: ['names = ["Nova", "Vertex", "Delta"]', 'ids = [101, 102, 103]', '<your arrangement goes here>'],
      prompt: 'Arrange the blocks so lookup[name] = id is built correctly using zip, with no crash and no wrong pairing.',
      exercise: {
        kind: 'order',
        chunks: [
          { id: 'A', text: 'lookup = {}' },
          { id: 'B', text: 'pairs = zip(names, ids)' },
          { id: 'C', text: 'for name, id_val in pairs:' },
          { id: 'D', text: '    lookup[name] = id_val' },
        ],
        correctOrder: ['A', 'B', 'C', 'D'],
        successTrace: [
          { line: 1, note: 'lookup starts empty', vars: { lookup: '{}' } },
          { line: 2, note: 'pairs built from names/ids in lockstep', vars: { pairs: '(Nova,101)(Vertex,102)(Delta,103)' } },
          { line: 4, note: 'Each pair assigned in order — no crash', vars: { lookup: '{Nova:101,Vertex:102,Delta:103}' } },
        ],
        altOutcomes: [
          { orderKey: 'B,A,C,D', note: 'pairs is built before lookup exists — order does not matter for this pair since neither depends on the other, so it also succeeds.', trace: [
            { line: 1, note: 'pairs built first (independent of lookup)', vars: { pairs: '(Nova,101)(Vertex,102)(Delta,103)' } },
            { line: 2, note: 'lookup created, then populated — same result', vars: { lookup: '{Nova:101,Vertex:102,Delta:103}' } },
          ] },
          { orderKey: 'A,C,B,D', note: 'the for-loop iterates pairs before pairs is defined.', trace: [{ line: 1, note: 'NameError: name \'pairs\' is not defined — block C runs before block B', vars: {} }] },
          { orderKey: 'C,D,A,B', note: 'the loop body runs before the loop (and lookup) exist at all.', trace: [{ line: 1, note: 'NameError: name \'pairs\' is not defined — nothing has been defined yet', vars: {} }] },
        ],
        explanation: 'pairs must exist before the for-loop iterates it, and lookup must exist before line D writes into it. Two orderings satisfy both constraints (A before D, B before C); everything else references a name before it is created.',
      },
    },
    {
      id: 'sn-conditions', category: 'conditions', title: 'Chained Comparison with Negation',
      code: ['x = 5', 'result = "mid" if 1 < x < 10 and not (x == 5) else "edge"'],
      prompt: 'Predict the final value of result.',
      exercise: {
        kind: 'predict',
        choices: [{ id: 'redge', label: '"edge"' }, { id: 'rmid', label: '"mid"' }, { id: 'rtrue', label: 'True' }, { id: 'rerr', label: 'SyntaxError' }],
        answerKey: 'redge',
        trace: [
          { line: 2, note: '1 < 5 < 10 is True (chained comparison)', vars: { '1<x<10': 'True' } },
          { line: 2, note: 'x == 5 is True, so not(True) is False', vars: { 'not(x==5)': 'False' } },
          { line: 2, note: 'True and False is False — else branch taken', vars: { result: '"edge"' } },
        ],
        explanation: 'Chained comparisons (1 < x < 10) evaluate as a single expression. Even though the range check passes, `not (x == 5)` cancels it out because x really is 5, so the overall condition is False.',
      },
    },
    {
      id: 'sn-dicts', category: 'dictionaries', title: 'Filtered Dict Comprehension',
      code: ['raw = [("a", 1), ("b", 2), ("a", 5)]', 'lookup = {k: v for k, v in raw if v > 1}'],
      prompt: 'Predict the value of lookup.get("a").',
      exercise: {
        kind: 'predict',
        choices: [{ id: 'g5', label: '5' }, { id: 'g1', label: '1' }, { id: 'gnone', label: 'None' }, { id: 'g6', label: '6' }],
        answerKey: 'g5',
        trace: [
          { line: 2, note: '("a", 1): v=1 fails v > 1 — excluded entirely', vars: { lookup: '{}' } },
          { line: 2, note: '("b", 2): v=2 passes — included', vars: { lookup: '{b:2}' } },
          { line: 2, note: '("a", 5): v=5 passes — included (this is the only "a" pair that survives the filter)', vars: { lookup: '{b:2,a:5}' } },
        ],
        explanation: 'The filter drops ("a", 1) before the dict is ever built, so there is no duplicate-key overwrite to reason about — the only surviving "a" entry has value 5.',
      },
    },
    {
      id: 'sn-functions', category: 'functions', title: 'Rolling Window Totals (Silent Overrun)',
      code: ['def moving_totals(nums, window):', '    totals = []', '    for i in range(len(nums) - window + 2):', '        totals.append(sum(nums[i:i+window]))', '    return totals', '# called with len(nums) = 6, window = 3'],
      prompt: 'Diagnose the defect (note: Python slicing never raises IndexError), then select the correct range bound.',
      exercise: {
        kind: 'correction',
        bugChoices: [
          { id: 'off_by_one_index_error', label: 'Off-by-one — will raise IndexError' },
          { id: 'off_by_one_silent_overrun', label: 'Off-by-one — silently returns an extra malformed window' },
          { id: 'type_error', label: 'TypeError on the slice' },
        ],
        bugAnswerKey: 'off_by_one_silent_overrun',
        choices: [
          { id: 'fixed', label: 'range(len(nums) - window + 1)', sublabel: 'Correct — 4 full windows' },
          { id: 'original', label: 'range(len(nums) - window + 2)', sublabel: 'Original — 1 short window appended' },
          { id: 'under', label: 'range(len(nums) - window)', sublabel: 'Drops the last valid window' },
        ],
        answerKey: 'fixed',
        tracesByChoice: {
          fixed: [
            { line: 3, note: 'i takes 0,1,2,3 — 4 full-length windows', vars: { i: '0..3' } },
            { line: 4, note: 'Every window has exactly 3 elements', vars: { totals: '[4 sums, all full windows]' } },
          ],
          original: [
            { line: 3, note: 'i takes 0,1,2,3,4 — one extra iteration', vars: { i: '0..4' } },
            { line: 4, note: 'nums[4:7] only has 2 elements (slicing does not crash) — a malformed short window is silently appended', vars: { totals: '[4 full sums, 1 malformed 2-element sum]' } },
          ],
          under: [
            { line: 3, note: 'i takes 0,1,2 — one too few', vars: { i: '0..2' } },
            { line: 4, note: 'The final valid window (i=3) is never computed — result is missing data, not crashed', vars: { totals: '[3 sums, last window dropped]' } },
          ],
        },
        explanation: 'Unlike list indexing, Python slice expressions never raise IndexError — nums[i:i+window] just returns fewer elements when it runs past the end. The +2 bug therefore fails silently with a short window rather than crashing, which makes it easy to miss in review.',
      },
    },
    {
      id: 'sn-errors', category: 'errors', title: 'Exception Subclass Ordering',
      code: ['class ValidationError(ValueError):', '    pass', '', 'def parse_age(raw):', '    age = int(raw)', '    if age < 0:', '        raise ValidationError("negative age")', '    return age', '# called with raw = "-5"'],
      prompt: 'Choose the except-clause ordering that correctly distinguishes a negative age from a plain parse failure.',
      exercise: {
        kind: 'correction',
        choices: [
          { id: 'specific_first', label: 'except ValidationError: ... / except ValueError: ...', sublabel: 'Correct — specific before general' },
          { id: 'general_first', label: 'except ValueError: ... / except ValidationError: ...', sublabel: 'Wrong order — ValidationError branch is unreachable' },
          { id: 'wrong_type', label: 'except TypeError: ...', sublabel: 'Does not match at all' },
        ],
        answerKey: 'specific_first',
        tracesByChoice: {
          specific_first: [
            { line: 7, note: 'raw="-5" parses to age=-5, raising ValidationError', vars: { age: '-5' } },
            { line: 8, note: 'except ValidationError matches first — handled as intended, returns None', vars: { result: 'None' } },
          ],
          general_first: [
            { line: 7, note: 'raw="-5" parses to age=-5, raising ValidationError', vars: { age: '-5' } },
            { line: 8, note: 'ValidationError IS-A ValueError, so the earlier except ValueError catches it first — the ValidationError branch never runs', vars: { result: '-1 (wrong branch, but no crash)' } },
          ],
          wrong_type: [
            { line: 7, note: 'raw="-5" parses to age=-5, raising ValidationError', vars: { age: '-5' } },
            { line: 8, note: 'except TypeError does not match ValidationError — unhandled', vars: { error: 'ValidationError (uncaught)' } },
          ],
        },
        explanation: 'Because ValidationError subclasses ValueError, except order matters: the more specific exception type must be listed first, or it will never be reached — a subtle bug that produces a wrong result silently instead of crashing.',
      },
    },
  ];
}

interface WorkbenchState {
  answers: Record<string, string>;
  bugAnswers: Record<string, string>;
  order: Record<string, string[]>;
}

function shuffledInitialOrder(snippet: Snippet): string[] {
  if (snippet.exercise.kind !== 'order') return [];
  const ids = snippet.exercise.chunks.map((c) => c.id);
  // Deterministic "shuffle": reverse the authored order so learners must actually reorder it.
  return [...ids].reverse();
}

function buildInitialState(snippets: Snippet[]): WorkbenchState {
  const order: Record<string, string[]> = {};
  snippets.forEach((s) => {
    if (s.exercise.kind === 'order') order[s.id] = shuffledInitialOrder(s);
  });
  return { answers: {}, bugAnswers: {}, order };
}

export default function PythonLogicDebuggingLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const snippets = useMemo(() => buildSnippets(variant), [variant]);
  const initialState = useMemo(() => buildInitialState(snippets), [snippets]);
  const { state, set, undo, redo, reset, canUndo, canRedo } = useUndoableState<WorkbenchState>(initialState);

  const [activeId, setActiveId] = useState(snippets[0].id);
  const [notesBySnippet, setNotesBySnippet] = useState<Record<string, string>>({});
  const [completionOrder, setCompletionOrder] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const activeSnippet = snippets.find((s) => s.id === activeId) ?? snippets[0];

  const markCompleted = (snippetId: string) => {
    setCompletionOrder((prev) => (prev.includes(snippetId) ? prev : [...prev, snippetId]));
  };

  const selectAnswer = (snippetId: string, choiceId: string) => {
    set((prev) => ({ ...prev, answers: { ...prev.answers, [snippetId]: choiceId } }));
    markCompleted(snippetId);
    onDirty();
  };
  const selectBug = (snippetId: string, choiceId: string) => {
    set((prev) => ({ ...prev, bugAnswers: { ...prev.bugAnswers, [snippetId]: choiceId } }));
    markCompleted(snippetId);
    onDirty();
  };
  const moveChunk = (snippetId: string, index: number, dir: -1 | 1) => {
    set((prev) => {
      const current = [...(prev.order[snippetId] ?? [])];
      const target = index + dir;
      if (target < 0 || target >= current.length) return prev;
      [current[index], current[target]] = [current[target], current[index]];
      return { ...prev, order: { ...prev.order, [snippetId]: current } };
    });
    markCompleted(snippetId);
    onDirty();
  };

  // Resolve the active trace + correctness for the active snippet.
  const active = useMemo(() => {
    const ex = activeSnippet.exercise;
    if (ex.kind === 'predict') {
      const chosen = state.answers[activeSnippet.id];
      return { trace: chosen ? ex.trace : [], isCorrect: chosen === ex.answerKey, hasAnswer: Boolean(chosen), noteMissing: false };
    }
    if (ex.kind === 'correction') {
      const chosen = state.answers[activeSnippet.id];
      const bugOk = ex.bugChoices ? state.bugAnswers[activeSnippet.id] === ex.bugAnswerKey : true;
      if (!chosen) return { trace: [], isCorrect: false, hasAnswer: false, noteMissing: false };
      return { trace: ex.tracesByChoice[chosen] ?? [], isCorrect: chosen === ex.answerKey && bugOk, hasAnswer: true, noteMissing: false };
    }
    // order
    const arrangement = state.order[activeSnippet.id] ?? [];
    const key = arrangement.join(',');
    const correctKey = ex.correctOrder.join(',');
    if (key === correctKey) return { trace: ex.successTrace, isCorrect: true, hasAnswer: true, noteMissing: false };
    const alt = ex.altOutcomes.find((a) => a.orderKey === key);
    if (alt) return { trace: alt.trace, isCorrect: false, hasAnswer: true, noteMissing: false };
    return { trace: [], isCorrect: false, hasAnswer: true, noteMissing: true };
  }, [activeSnippet, state]);

  // Reset the trace-playback position whenever the active snippet or its resolved
  // trace changes. Adjusting state directly during render (rather than in a
  // useEffect) avoids an extra cascading render pass — see
  // https://react.dev/learn/you-might-not-need-an-effect.
  const traceResetKey = `${activeSnippet.id}|${active.trace.length}`;
  const [lastTraceResetKey, setLastTraceResetKey] = useState(traceResetKey);
  if (traceResetKey !== lastTraceResetKey) {
    setLastTraceResetKey(traceResetKey);
    setStepIndex(0);
  }

  const traceLen = active.trace.length;
  const currentFrame = traceLen > 0 ? active.trace[Math.min(stepIndex, traceLen - 1)] : null;

  const correctCount = useMemo(() => {
    let n = 0;
    snippets.forEach((s) => {
      const ex = s.exercise;
      if (ex.kind === 'predict') { if (state.answers[s.id] === ex.answerKey) n++; }
      else if (ex.kind === 'correction') {
        const bugOk = ex.bugChoices ? state.bugAnswers[s.id] === ex.bugAnswerKey : true;
        if (state.answers[s.id] === ex.answerKey && bugOk) n++;
      } else {
        const arrangement = (state.order[s.id] ?? []).join(',');
        if (arrangement === ex.correctOrder.join(',')) n++;
      }
    });
    return n;
  }, [snippets, state]);

  const accuracyChart = useMemo(() => {
    const answered = snippets.filter((s) => {
      const ex = s.exercise;
      if (ex.kind === 'order') return Boolean(state.order[s.id]);
      return Boolean(state.answers[s.id]);
    }).length;
    return { correct: correctCount, incorrect: Math.max(0, answered - correctCount), unanswered: snippets.length - answered };
  }, [snippets, state, correctCount]);

  const studyNotes = Object.entries(notesBySnippet).map(([id, note]) => `[${id}] ${note}`).filter((s) => s.trim().length > 4).join(' | ');

  const handleExportCsv = () => {
    downloadCsv('python_debugging_trace_log.csv', snippets.map((s) => ({
      snippet_id: s.id, category: s.category, exercise_type: s.exercise.kind,
      answer: state.answers[s.id] ?? (s.exercise.kind === 'order' ? (state.order[s.id] ?? []).join('>') : ''),
      bug_choice: state.bugAnswers[s.id] ?? '',
    })));
  };
  const handleExportJson = () => {
    downloadJson('python_debugging_notes.json', { variant, orderedSnippetIds: completionOrder, predictions: state.answers, bugChoices: state.bugAnswers, orderArrangements: state.order, notesBySnippet });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      orderedSnippetIds: completionOrder,
      predictions: state.answers,
      bugChoices: state.bugAnswers,
      orderArrangements: state.order,
      correctCount,
      totalSnippets: snippets.length,
      studyNotes,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Execution Runtime</span>
          <span className="text-sm font-black text-purple-300">Authored Python Trace Frames</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Prepared examples only — no live interpreter</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Snippets Reviewed</span>
          <span className="text-xl font-black text-white">{completionOrder.length} / {snippets.length}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">{activeSnippet.category}</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Diagnostic Accuracy</span>
          <span className="text-xl font-black text-purple-200">{correctCount} / {snippets.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Verified against answer key</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">History Step</span>
          <span className="text-xl font-black text-cyan-300">{state.answers ? Object.keys(state.answers).length + Object.keys(state.bugAnswers).length : 0}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Decisions in undo stack</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {snippets.map((s) => (
          <button key={s.id} type="button" onClick={() => setActiveId(s.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${activeId === s.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
            {s.category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#0d0f1a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-extrabold text-purple-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>{activeSnippet.title} (Read-Only Syntax Card)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); onDirty(); }} title="Reset all answers"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs space-y-1.5">
              {activeSnippet.code.map((line, i) => (
                <div key={i} className={`p-1 rounded whitespace-pre-wrap ${currentFrame?.line === i + 1 ? 'bg-amber-500/25 text-amber-200 font-bold' : 'text-slate-400'}`}>
                  {i + 1}:  {line}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic">{activeSnippet.prompt}</p>
          </div>

          {activeSnippet.exercise.kind === 'order' && (
            <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-purple-400" />
                <span>Reorder Statement Blocks</span>
              </h3>
              {(state.order[activeSnippet.id] ?? []).map((chunkId, idx) => {
                const chunk = activeSnippet.exercise.kind === 'order' ? activeSnippet.exercise.chunks.find((c) => c.id === chunkId) : undefined;
                return (
                  <div key={chunkId} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => moveChunk(activeSnippet.id, idx, -1)} disabled={idx === 0} className="p-0.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20">
                        <ArrowUp className="w-3 h-3 text-slate-300" />
                      </button>
                      <button type="button" onClick={() => moveChunk(activeSnippet.id, idx, 1)} disabled={idx === (state.order[activeSnippet.id]?.length ?? 0) - 1} className="p-0.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20">
                        <ArrowDown className="w-3 h-3 text-slate-300" />
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap flex-1">{chunk?.text}</pre>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span>Flowchart Position</span>
            </h3>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
              {['INPUT', 'PROCESS', 'CHECK', 'OUTPUT'].map((node, i) => {
                const zone = traceLen > 0 ? Math.floor((Math.min(stepIndex, traceLen - 1) / Math.max(1, traceLen - 1)) * 3) : -1;
                return (
                  <React.Fragment key={node}>
                    <div className={`p-2.5 rounded-xl border ${zone === i ? 'bg-cyan-600/30 border-cyan-500/50 text-cyan-200' : 'bg-slate-800/60 border-white/10 text-slate-500'}`}>{node}</div>
                    {i < 3 && <ArrowRight className="w-3.5 h-3.5 text-slate-500" />}
                  </React.Fragment>
                );
              })}
            </div>
            {traceLen > 0 ? (
              <SimClock label="Trace Playback" step={Math.min(stepIndex, traceLen - 1)} maxStep={traceLen - 1}
                stepLabel={(s) => `Frame ${s + 1}/${traceLen}`}
                onAdvance={() => setStepIndex((s) => Math.min(s + 1, traceLen - 1))}
                onReset={() => setStepIndex(0)} />
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                {active.noteMissing ? 'No prepared example for this exact arrangement — try the canonical order or a listed alternative.' : 'Select an answer to load its authored trace frames.'}
              </p>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Variable State Inspector</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
              {currentFrame ? Object.entries(currentFrame.vars).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">{k}</span>
                  <span className="font-bold text-emerald-300 truncate block">{v}</span>
                </div>
              )) : <span className="text-slate-500 italic text-[11px]">No active frame.</span>}
            </div>
            {currentFrame && (
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                  <span className="text-[10px] text-cyan-400 block font-bold">INPUT</span>
                  <span className="text-[11px] text-slate-300">{activeSnippet.code[0]}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 block font-bold">OUTPUT / NOTE</span>
                  <span className="text-[11px] text-slate-300">{currentFrame.note}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Bug className="w-4 h-4 text-purple-400" />
              <span>Diagnosis &amp; Answer</span>
            </h3>

            {activeSnippet.exercise.kind === 'correction' && activeSnippet.exercise.bugChoices && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">1. What kind of defect is this?</label>
                {activeSnippet.exercise.bugChoices.map((c) => (
                  <button key={c.id} type="button" onClick={() => selectBug(activeSnippet.id, c.id)}
                    className={`w-full p-2 rounded-xl border text-left text-xs font-semibold transition-all ${state.bugAnswers[activeSnippet.id] === c.id ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {(activeSnippet.exercise.kind === 'predict' || activeSnippet.exercise.kind === 'correction') && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  {activeSnippet.exercise.kind === 'correction' ? '2. Select the correction' : 'Select your prediction'}
                </label>
                {(activeSnippet.exercise as PredictExercise | CorrectionExercise).choices.map((c) => (
                  <button key={c.id} type="button" onClick={() => selectAnswer(activeSnippet.id, c.id)}
                    className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${state.answers[activeSnippet.id] === c.id ? 'bg-purple-600/20 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    {c.label} {c.sublabel && <span className="text-[10px] text-slate-500 font-sans ml-1">({c.sublabel})</span>}
                  </button>
                ))}
              </div>
            )}

            {activeSnippet.exercise.kind === 'order' && (
              <p className="text-[11px] text-slate-400">Use the up/down arrows on the left to arrange the statement blocks, then review the resulting trace.</p>
            )}

            {active.hasAnswer && !active.noteMissing && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${active.isCorrect ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-amber-950/20 border-amber-500/30 text-amber-200'}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{active.isCorrect ? 'Correct — ' : 'Not quite — '}{activeSnippet.exercise.explanation}</span>
              </div>
            )}
          </div>

          <ChartFrame
            title="Diagnostic Accuracy Breakdown"
            icon={<CheckCircle2 className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Status', 'Snippets']}
            tableRows={[['Correct', accuracyChart.correct], ['Incorrect', accuracyChart.incorrect], ['Unanswered', accuracyChart.unanswered]]}
          >
            <BreakdownDoughnutChart
              labels={['Correct', 'Incorrect', 'Unanswered']}
              values={[accuracyChart.correct, accuracyChart.incorrect, accuracyChart.unanswered]}
              centerValue={`${correctCount}/${snippets.length}`}
              centerLabel="Correct"
            />
          </ChartFrame>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="debug-notes" className="text-xs font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Notes for {activeSnippet.title} (free text — never executed)</span>
            </label>
            <textarea id="debug-notes" rows={4} value={notesBySnippet[activeSnippet.id] ?? ''}
              onChange={(e) => { setNotesBySnippet((prev) => ({ ...prev, [activeSnippet.id]: e.target.value })); onDirty(); }}
              placeholder="Explain the root cause and why the fix works. Any code you type here is a note only — it is not run."
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Python Debugging Patch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
