// KAM website configuration
// ---------------------------------------------------------------
// Leave both values empty to run in DEMO mode (data is kept in the
// browser only). After creating the Supabase project, paste the
// Project URL and the "anon public" key here (Supabase dashboard ->
// Project Settings -> API). The anon key is safe to publish: access
// is controlled by the Row Level Security rules in supabase/schema.sql.
export const CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  defaultLang: "ar",
  languages: ["ar", "en", "tr"],
};
