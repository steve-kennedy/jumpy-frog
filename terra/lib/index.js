module.exports = ({ wallets, refs, config, client }) => ({
  getScores: () => client.query("game", { get_scores: {} }),
  upsertScore: (score, signer = wallets.validator) =>
    client.execute(signer, "game", { upsert_score: { score } }),
});
