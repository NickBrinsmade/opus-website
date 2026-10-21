# opus-website

Static pages for Opus, served by GitHub Pages from `main`. A push to `main` deploys.

- `/merge-artists/` — people tell us which artist entries in Opus are the same person.
  Submitting only records a row in `artist_merge_requests`. Nothing in the app changes
  until `datasets/apply_artist_merges.py` in opus-backend applies it.
  Live: https://nickbrinsmade.github.io/opus-website/merge-artists/

The pages talk to Supabase with the publishable key, the same one the app ships with.
Row-level security and column grants in the database decide what that key can do, so
it's safe to be public. Never put a secret or service-role key here: this repo is public.

Run locally:

```bash
python3 -m http.server 8790 --directory opus-website
# http://localhost:8790/merge-artists/
```
