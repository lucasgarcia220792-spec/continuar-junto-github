import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DepositWithdrawDialog } from './DepositWithdrawDialog';
import { User, Wallet, LogOut, Crown } from 'lucide-react';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  balance: number;
}

interface UserProfileProps {
  onSignOut: () => void;
  refreshTrigger: number;
}

export function UserProfile({ onSignOut, refreshTrigger }: UserProfileProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (!data) {
      // Se não existe perfil, criar um novo
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Jogador VIP',
          username: user.user_metadata?.username || null,
          balance: 0.00
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
      } else {
        setProfile(newProfile);
      }
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <Card className="gaming-card w-full max-w-md border-accent/30">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted/50 rounded w-3/4"></div>
            <div className="h-4 bg-muted/50 rounded w-1/2"></div>
            <div className="h-8 bg-muted/50 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleTransactionComplete = () => {
    fetchProfile();
  };

  return (
    <Card className="gaming-card w-full max-w-md border-accent/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-orbitron flex items-center gap-2 neon-text">
          <Crown className="h-6 w-6 text-accent" />
          Perfil VIP
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="font-bold text-lg">{profile?.full_name || 'Jogador VIP'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <User className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl border border-accent/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet className="h-6 w-6 text-accent" />
              <p className="text-sm font-medium text-muted-foreground">Saldo Disponível</p>
            </div>
            <p className="font-orbitron font-black text-3xl gold-text">
              R$ {profile?.balance?.toFixed(2) || '0.00'}
            </p>
            <Badge variant="outline" className="mt-2 border-accent/50 bg-accent/10">
              <Crown className="mr-1 h-3 w-3" />
              Conta Premium
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <DepositWithdrawDialog onTransactionComplete={handleTransactionComplete} />
          
          <Button 
            onClick={onSignOut} 
            variant="outline" 
            className="w-full font-orbitron font-bold border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sair da Conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}