-- users
CREATE INDEX idx_users_league        ON public.users (league);
CREATE INDEX idx_users_xp_total      ON public.users (xp_total DESC);

-- worlds / units / lessons
CREATE INDEX idx_units_world_id      ON public.units (world_id, "order");
CREATE INDEX idx_lessons_unit_id     ON public.lessons (unit_id);

-- progress
CREATE INDEX idx_progress_user_id    ON public.progress (user_id);
CREATE INDEX idx_progress_lesson_id  ON public.progress (lesson_id);
CREATE INDEX idx_progress_status     ON public.progress (user_id, status);

-- prompts_saved
CREATE INDEX idx_prompts_user_id     ON public.prompts_saved (user_id);
CREATE INDEX idx_prompts_category    ON public.prompts_saved (user_id, category);

-- daily_challenges
CREATE UNIQUE INDEX idx_challenges_date ON public.daily_challenges (date);

-- challenge_entries
CREATE INDEX idx_entries_challenge   ON public.challenge_entries (challenge_id);
CREATE INDEX idx_entries_user        ON public.challenge_entries (user_id);
CREATE INDEX idx_entries_score       ON public.challenge_entries (challenge_id, score DESC);

-- xp_events
CREATE INDEX idx_xp_events_user      ON public.xp_events (user_id);
CREATE INDEX idx_xp_events_created   ON public.xp_events (user_id, created_at DESC);

-- streaks
CREATE INDEX idx_streaks_user_date   ON public.streaks (user_id, date DESC);

-- leagues
CREATE INDEX idx_leagues_week_tier   ON public.leagues (week_start DESC, tier);

-- badges
CREATE INDEX idx_badges_criteria     ON public.badges (criteria_type, criteria_value);
