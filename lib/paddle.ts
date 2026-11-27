/**
 * Paddle checkout configuration for GrantScope Pro.
 *
 * The account is Paddle's live (production) environment. The client-side
 * token below is a public token designed to be embedded in client-side
 * code — it is not a secret API key.
 *
 * Price IDs are from the "GrantScope Pro" product in the Paddle dashboard.
 */
export const PADDLE_CLIENT_TOKEN = "live_54c56d0ec82ed63539672ca646a";

export const PADDLE_PRICE_IDS = {
  weekly: "pri_01m8d9cygzyca8rkm4chtrrb5h",
  monthly: "pri_01m8d9epydhykhddgbatyk7tyy",
  yearly: "pri_01m8d9fkxn7b6xc1xabqb88rjt",
} as const;

export type PaddlePlanKey = keyof typeof PADDLE_PRICE_IDS;
