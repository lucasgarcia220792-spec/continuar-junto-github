import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Apostas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Apostas</CardTitle>
      </CardHeader>
      <CardContent>
        {bets.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma aposta realizada ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className={`p-3 rounded-lg border ${
                  bet.result
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {bet.result ? '🎉 Vitória' : '😔 Derrota'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(bet.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {bet.amount.toFixed(2)}
                    </p>
                    {bet.result && (
                      <p className="text-sm text-green-600">
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