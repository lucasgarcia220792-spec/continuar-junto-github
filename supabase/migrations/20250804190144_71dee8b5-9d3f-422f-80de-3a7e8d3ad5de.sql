-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on bets table  
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own bets
CREATE POLICY "Users can view their own bets" 
ON public.bets 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own bets
CREATE POLICY "Users can insert their own bets" 
ON public.bets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own bets (if needed)
CREATE POLICY "Users can update their own bets" 
ON public.bets 
FOR UPDATE 
USING (auth.uid() = user_id);