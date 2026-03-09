-- ============================================================
-- EXTENSION
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: users
-- Mirrors auth.users; populated via trigger on signup
-- ============================================================
CREATE TABLE public.users (
  id               uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            text        NOT NULL UNIQUE,
  name             text        NOT NULL DEFAULT '',
  avatar_url       text,
  xp_total         integer     NOT NULL DEFAULT 0 CHECK (xp_total >= 0),
  level            integer     NOT NULL DEFAULT 1 CHECK (level >= 1),
  current_streak   integer     NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  max_streak       integer     NOT NULL DEFAULT 0 CHECK (max_streak >= 0),
  league           text        NOT NULL DEFAULT 'bronze'
                               CHECK (league IN ('bronze','silver','gold','platinum','diamond')),
  profession       text,
  ai_experience_level text     CHECK (ai_experience_level IN ('none','beginner','intermediate','advanced')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: worlds
-- Top-level curriculum containers (e.g., "Fundamentals", "Work")
-- ============================================================
CREATE TABLE public.worlds (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text    NOT NULL,
  description text    NOT NULL DEFAULT '',
  icon        text,
  "order"     integer NOT NULL DEFAULT 0,
  is_premium  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: units
-- Ordered groups of lessons within a world
-- ============================================================
CREATE TABLE public.units (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id    uuid    NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  title       text    NOT NULL,
  description text    NOT NULL DEFAULT '',
  "order"     integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: lessons
-- Individual learning activities inside a unit
-- ============================================================
CREATE TABLE public.lessons (
  id           uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id      uuid  NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  title        text  NOT NULL,
  type         text  NOT NULL CHECK (type IN ('tutorial','practice','challenge','quiz')),
  content_json jsonb NOT NULL DEFAULT '{}',
  difficulty   text  NOT NULL DEFAULT 'beginner'
               CHECK (difficulty IN ('beginner','intermediate','advanced')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: badges
-- Achievement definitions (no user-specific data here)
-- ============================================================
CREATE TABLE public.badges (
  id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text    NOT NULL UNIQUE,
  description     text    NOT NULL DEFAULT '',
  icon            text,
  criteria_type   text    NOT NULL
                  CHECK (criteria_type IN ('xp_threshold','streak_days','lessons_completed',
                                           'challenge_wins','perfect_score','manual')),
  criteria_value  integer NOT NULL DEFAULT 0 CHECK (criteria_value >= 0),
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: daily_challenges
-- One challenge per calendar date; best_prompt_id is nullable
-- until a winner is chosen
-- ============================================================
CREATE TABLE public.daily_challenges (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date               date NOT NULL UNIQUE,
  scenario           text NOT NULL,
  best_prompt_id     uuid,
  participants_count integer NOT NULL DEFAULT 0 CHECK (participants_count >= 0),
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: challenge_entries
-- User submissions to daily_challenges
-- ============================================================
CREATE TABLE public.challenge_entries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid    NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  user_id      uuid    NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prompt_text  text    NOT NULL,
  score        integer NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  votes        integer NOT NULL DEFAULT 0 CHECK (votes >= 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, user_id)
);

-- Add the deferred self-referential FK now that challenge_entries exists
ALTER TABLE public.daily_challenges
  ADD CONSTRAINT fk_best_prompt
  FOREIGN KEY (best_prompt_id)
  REFERENCES public.challenge_entries(id)
  ON DELETE SET NULL;

-- ============================================================
-- TABLE: progress
-- Per-user, per-lesson learning state
-- ============================================================
CREATE TABLE public.progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid    NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id    uuid    NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status       text    NOT NULL DEFAULT 'not_started'
               CHECK (status IN ('not_started','in_progress','completed')),
  prompt_score integer CHECK (prompt_score BETWEEN 0 AND 100),
  attempts     integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  xp_earned    integer NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
  completed_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

-- ============================================================
-- TABLE: prompts_saved
-- User's personal prompt library
-- ============================================================
CREATE TABLE public.prompts_saved (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT '',
  prompt_text text NOT NULL,
  category    text,
  score       integer CHECK (score BETWEEN 0 AND 100),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: xp_events
-- Immutable ledger of every XP award (insert-only via service role)
-- ============================================================
CREATE TABLE public.xp_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid    NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source     text    NOT NULL
             CHECK (source IN ('lesson_complete','challenge_entry','streak_bonus',
                               'perfect_score','badge_awarded','manual_admin')),
  amount     integer NOT NULL CHECK (amount > 0),
  multiplier numeric(4,2) NOT NULL DEFAULT 1.00 CHECK (multiplier > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: streaks
-- One row per user per calendar date to track daily activity
-- ============================================================
CREATE TABLE public.streaks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date        date NOT NULL,
  completed   boolean NOT NULL DEFAULT false,
  freeze_used boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

-- ============================================================
-- TABLE: leagues
-- Weekly competitive groupings; user_ids is a snapshot array
-- ============================================================
CREATE TABLE public.leagues (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start   date NOT NULL,
  tier         text NOT NULL
               CHECK (tier IN ('bronze','silver','gold','platinum','diamond')),
  user_ids     uuid[] NOT NULL DEFAULT '{}',
  results_json jsonb  NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (week_start, tier)
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_prompts_saved_updated_at
  BEFORE UPDATE ON public.prompts_saved
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON AUTH SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
