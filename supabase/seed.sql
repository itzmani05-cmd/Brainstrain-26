-- Brainstrain '26 — starter event catalogue
-- Run after schema.sql. Safe to re-run (upserts on slug).
-- image_url stores the bundled frontend asset key (see src/data/eventImages.js),
-- not an external URL — swap it for a real Supabase Storage URL if you upload posters later.

insert into public.events
  (name, slug, description, guidelines, rules, category, image_url, contact_name, contact_phone, prize_pool, is_team_event, min_team_size, max_team_size, registration_open, registration_deadline)
values
  (
    'Adzap', 'adzap',
    'Pitch the most outrageous product ideas imaginable! Say invisible socks or a smartphone that only works when you''re asleep. Get creative, get funny, and keep the audience in stitches.',
    array['Your product idea/ad should be unique and humorous. Think outside the box.', 'Ensure all team members have a role in the ad and contribute to the overall performance.', 'The use of simple props is allowed. Make sure any props are easy to manage within the time constraints.', 'Be mindful of the time.'],
    array['Each team should have 4-6 members.', 'You will have 7 minutes to brainstorm and script your ad.', 'Your performance should last 4-5 minutes. Going over the time limit will cost you points.', 'Make sure your humor is clean. Offensive content or vulgar language is not allowed.', 'The judge''s decision is final.'],
    'Performance', 'adzap', 'Muthu Pavithra', '9191090917', 'Rs.2000',
    true, 4, 6, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Debate', 'debate',
    'Take a stand and defend it. A classic for-and-against debate that rewards sharp arguments, quick rebuttals, and a commanding stage presence.',
    array['Topics will be announced on the spot.', 'Speak for and against the motion as assigned.', 'Personal attacks and offensive language are not allowed.'],
    array['Each team should have 2 members.', 'Each speaker gets 3 minutes, with 1 minute for rebuttal.', 'Judges'' decision is final.'],
    'Speaking', 'debate', 'Muthu Pavithra', '9191090917', 'Rs.2000',
    true, 2, 2, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Uno Minuto', 'uno-minuto',
    'The classic "Just a Minute" challenge — speak on a surprise topic for a full sixty seconds without hesitation, repetition, or deviation.',
    array['Topics are revealed only when you take the stage.', 'Keep speaking for the entire minute without long pauses.', 'Stay on topic — no deviation.'],
    array['Individual participation only.', 'You get exactly 60 seconds per topic.', 'Hesitation, repetition or deviation may cost you points.'],
    'Speaking', 'uno-minuto', 'Muthu Pavithra', '9191090917', 'Rs.1500',
    false, 1, 1, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Puzzle', 'puzzle',
    'A trail of riddles, wordplay, and lateral-thinking puzzles. Race the clock and your fellow teams to crack every clue first.',
    array['Work through the puzzle stations in order.', 'No searching the internet for answers.', 'Ask a volunteer if you think a clue is broken.'],
    array['Teams of 2-4 members.', 'Fastest team with the most correct answers wins.', 'Any form of external help leads to disqualification.'],
    'Puzzle', 'puzzle', 'Muthu Pavithra', '9191090917', 'Rs.1500',
    true, 2, 4, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Drama', 'drama',
    'Bring a story to life on stage. Original scripts, bold characters, and a live audience — this is theatre in its rawest form.',
    array['Original scripts only; no copyrighted material without adaptation.', 'Keep props minimal and easy to set up within the time limit.', 'Content should be appropriate for a general audience.'],
    array['Each team should have 4-8 members.', 'Performances are limited to 10 minutes including setup.', 'The judge''s decision is final.'],
    'Performance', 'drama', 'Muthu Pavithra', '9191090917', 'Rs.2500',
    true, 4, 8, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Quiz', 'quiz',
    'Test your general knowledge, literature trivia, and quick recall across multiple rounds of questions.',
    array['Multiple rounds including a rapid-fire buzzer round.', 'No use of phones or reference material during the quiz.', 'Team coordination is key — only the appointed speaker may answer.'],
    array['Teams of 2 members.', 'Each wrong buzzer answer carries negative marking.', 'Quizmaster''s decision is final.'],
    'Quiz', 'quiz', 'Muthu Pavithra', '9191090917', 'Rs.1500',
    true, 2, 2, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'JAM', 'jam',
    'Just A Minute — mount the podium and hold the room''s attention with a spontaneous, structured minute of speech.',
    array['Topics are given just before you speak.', 'Maintain eye contact and clear articulation.', 'Stick to the assigned time.'],
    array['Individual participation only.', 'Each participant speaks for 1 minute per topic, across 2 rounds.', 'The judge''s decision is final.'],
    'Speaking', 'jam', 'Muthu Pavithra', '9191090917', 'Rs.1500',
    false, 1, 1, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Shipwreck', 'shipwreck',
    'Your ship is going down and you can only save a handful of items and people. A group discussion event that tests persuasion, negotiation, and teamwork under pressure.',
    array['Listen actively and build on others'' points.', 'Avoid talking over other participants.', 'Reach a group consensus within the time limit.'],
    array['Groups of 3-5 participants, formed on the spot.', 'Each group discussion round lasts 15 minutes.', 'Dominating the floor without letting others speak will cost you points.'],
    'Group Discussion', 'shipwreck', 'Muthu Pavithra', '9191090917', 'Rs.2000',
    true, 3, 5, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Poem', 'poem',
    'Write and perform an original poem on a given theme. Rhythm, imagery, and voice are all fair game.',
    array['The poem must be original and written for this event.', 'Any language is welcome, but please provide an English gist if not in English.', 'Recitation should not exceed the time limit.'],
    array['Individual participation only.', 'Recitation time limit: 3 minutes.', 'Plagiarism leads to immediate disqualification.'],
    'Literary', 'poem', 'Muthu Pavithra', '9191090917', 'Rs.1000',
    false, 1, 1, true, timezone('utc', now()) + interval '30 days'
  ),
  (
    'Microtale', 'microtale',
    'Tell a complete story in as few words as possible. A flash-fiction challenge that rewards precision and a sharp final line.',
    array['Stories must be original and written on the spot.', 'Stick to the given word limit and theme.', 'Handwritten submissions only, unless stated otherwise.'],
    array['Individual participation only.', 'Word limit: 100 words.', 'Submissions after the time limit will not be accepted.'],
    'Literary', 'microtale', 'Muthu Pavithra', '9191090917', 'Rs.1000',
    false, 1, 1, true, timezone('utc', now()) + interval '30 days'
  )
on conflict (slug) do nothing;
