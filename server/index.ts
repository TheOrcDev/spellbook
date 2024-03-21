import { spellbooksRouter } from "./routers/spellbooks";
import { spellsRouter } from "./routers/spells";
import { router } from "./trpc";

export const appRouter = router({
  spells: spellsRouter,
  spellbooks: spellbooksRouter,
});

export type AppRouter = typeof appRouter;
