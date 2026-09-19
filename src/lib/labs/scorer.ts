// Backward-compatible barrel. Per-lab scoring logic now lives in ./scorers/<slug>.ts
// so each lab's simulator + scorer can be edited independently.
export * from './scorers/index';
