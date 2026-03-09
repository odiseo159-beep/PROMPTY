-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worlds            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts_saved     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues           ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- users
-- ============================================================
CREATE POLICY "users: authenticated read all"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users: update own row"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================
-- worlds / units / lessons / badges — read-only for authenticated
-- ============================================================
CREATE POLICY "worlds: authenticated read"
  ON public.worlds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "units: authenticated read"
  ON public.units FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lessons: authenticated read"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "badges: authenticated read"
  ON public.badges FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- daily_challenges — read-only for authenticated
-- ============================================================
CREATE POLICY "daily_challenges: authenticated read"
  ON public.daily_challenges FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- challenge_entries
-- ============================================================
CREATE POLICY "challenge_entries: authenticated read all"
  ON public.challenge_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "challenge_entries: insert own"
  ON public.challenge_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "challenge_entries: update own"
  ON public.challenge_entries FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- progress
-- ============================================================
CREATE POLICY "progress: select own"
  ON public.progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "progress: insert own"
  ON public.progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress: update own"
  ON public.progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- prompts_saved — full CRUD on own rows
-- ============================================================
CREATE POLICY "prompts_saved: select own"
  ON public.prompts_saved FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "prompts_saved: insert own"
  ON public.prompts_saved FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "prompts_saved: update own"
  ON public.prompts_saved FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "prompts_saved: delete own"
  ON public.prompts_saved FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- xp_events — read own only; NO client insert
-- ============================================================
CREATE POLICY "xp_events: select own"
  ON public.xp_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- streaks
-- ============================================================
CREATE POLICY "streaks: select own"
  ON public.streaks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "streaks: insert own"
  ON public.streaks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "streaks: update own"
  ON public.streaks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- leagues — read-only for authenticated
-- ============================================================
CREATE POLICY "leagues: authenticated read"
  ON public.leagues FOR SELECT
  TO authenticated
  USING (true);
