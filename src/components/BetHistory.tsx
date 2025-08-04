import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { History, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface Bet {
  id: string;
  amount: number;
  multiplier: number;
  result: boolean;
  payout: number;
  created_at: string;
}

interface BetHistoryProps {
  refreshTrigger: number;
}

export function BetHistory({ refreshTrigger }: BetHistoryProps) {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBets = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching bets:', error);
    } else {
      setBets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBets();
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <Card className="gaming-card w-full max-w-md border-secondary/30">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Apostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalWins = bets.filter(bet => bet.result).length;
  const totalLosses = bets.filter(bet => !bet.result).length;
  const winRate = bets.length > 0 ? ((totalWins / bets.length) * 100).toFixed(1) : '0';

  return (
    <Card className="gaming-card w-full max-w-md border-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5 pointer-events-none"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-lg font-orbitron flex items-center gap-2 neon-text">
          <History className="h-5 w-5 text-secondary" />
          Histórico de Apostas
        </CardTitle>
        
        {bets.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Badge variant="outline" className="border-secondary/50 bg-secondary/10 justify-center py-2">
              <TrendingUp className="mr-1 h-3 w-3" />
              {totalWins}V
            </Badge>
            <Badge variant="outline" className="border-destructive/50 bg-destructive/10 justify-center py-2">
              <TrendingDown className="mr-1 h-3 w-3" />
              {totalLosses}D
            </Badge>
            <Badge variant="outline" className="border-accent/50 bg-accent/10 justify-center py-2 font-bold">
              {winRate}%
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        {bets.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground font-medium">
              Nenhuma aposta realizada ainda.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Faça sua primeira aposta para ver o histórico!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className={`p-4 rounded-lg border relative overflow-hidden ${
                  bet.result
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'bg-destructive/10 border-destructive/30'
                }`}
              >
                <div className="absolute inset-0 opacity-5">
                  {bet.result ? '🎉' : '💀'}
                </div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {bet.result ? (
                        <Badge variant="outline" className="border-secondary/50 bg-secondary/20 text-secondary">
                          🎉 Vitória
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-destructive/50 bg-destructive/20 text-destructive">
                          💀 Derrota
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(bet.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      R$ {bet.amount.toFixed(2)}
                    </p>
                    {bet.result && (
                      <p className="text-sm font-bold text-secondary">
                        +R$ {bet.payout.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}