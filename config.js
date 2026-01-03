import  {createClient} from 'https://esm.sh/@supabase/supabase-js'


const supUrl = "https://tzxpslcpmdxaznwlpquc.supabase.co"
const supKey = "sb_publishable_ep37EwGHygIocG1eoiTLmA_A9G2cC7U"


//intialize
const supabase = createClient(supUrl,supKey)

console.log(supabase);

export default supabase;