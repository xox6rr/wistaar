import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, Trash2, Shield, ShieldCheck } from 'lucide-react';

interface AdminRecord {
  id: string;
  user_id: string;
  granted_by: string;
  can_approve_reject: boolean;
  can_manage_coupons: boolean;
  can_manage_admins: boolean;
  is_super_admin: boolean;
  created_at: string;
  email: string;
  display_name: string;
}

export default function AdminManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [permissions, setPermissions] = useState({
    can_approve_reject: true,
    can_manage_coupons: false,
    can_manage_admins: false,
  });

  useEffect(() => { loadAdmins(); }, [user]);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_admins_with_emails' as any);
      if (error) throw error;
      setAdmins((data as unknown as AdminRecord[]) || []);
    } catch (err: any) {
      console.error('Load admins error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newEmail.trim() || !user) return;
    setAdding(true);
    try {
      const { error } = await supabase.rpc('add_admin_by_email' as any, {
        target_email: newEmail.trim().toLowerCase(),
        p_can_approve_reject: permissions.can_approve_reject,
        p_can_manage_coupons: permissions.can_manage_coupons,
        p_can_manage_admins: permissions.can_manage_admins,
        p_granted_by: user.id,
      });
      if (error) throw error;

      // Find the new admin's user_id so we can send them a notification
      const { data: adminsData } = await supabase.rpc('get_admins_with_emails' as any);
      const newAdmin = (adminsData as any[])?.find(
        (a: any) => a.email?.toLowerCase() === newEmail.trim().toLowerCase()
      );

      if (newAdmin?.user_id) {
        const permList = [
          permissions.can_approve_reject && 'approve/reject books',
          permissions.can_manage_coupons && 'manage coupons',
          permissions.can_manage_admins && 'manage admins',
        ].filter(Boolean).join(', ');

        await supabase.from('notifications' as any).insert({
          user_id: newAdmin.user_id,
          title: '🎉 You have been granted Admin access',
          message: `You now have admin privileges on Wistaar. Permissions: ${permList || 'approve/reject books'}.`,
          type: 'admin_promotion',
        } as any);
      }

      toast({ title: 'Admin added!', description: `${newEmail} now has admin access.` });
      setNewEmail('');
      setPermissions({ can_approve_reject: true, can_manage_coupons: false, can_manage_admins: false });
      await loadAdmins();
    } catch (err: any) {
      toast({ title: 'Failed to add admin', description: err.message, variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const handleUpdatePermissions = async (adminId: string, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_permissions' as any)
        .update({ [field]: value })
        .eq('id', adminId);
      if (error) throw error;
      setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, [field]: value } : a));
      toast({ title: 'Permissions updated' });
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleRemoveAdmin = async (admin: AdminRecord) => {
    try {
      await supabase.from('admin_permissions' as any).delete().eq('id', admin.id);
      await supabase.from('user_roles').delete().eq('user_id', admin.user_id).eq('role', 'admin');
      toast({ title: 'Admin removed', description: `${admin.email} no longer has admin access.` });
      await loadAdmins();
    } catch (err: any) {
      toast({ title: 'Remove failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The user must already have an account on Wistaar before you can grant them admin access.
          </p>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
              type="email"
              onKeyDown={e => e.key === 'Enter' && handleAddAdmin()}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Permissions for this admin</Label>
            <div className="flex flex-col gap-3">
              {[
                { key: 'can_approve_reject', label: 'Can approve / reject book submissions' },
                { key: 'can_manage_coupons', label: 'Can create and manage coupon codes' },
                { key: 'can_manage_admins', label: 'Can add and remove other admins' },
              ].map(p => (
                <div key={p.key} className="flex items-center gap-3">
                  <Switch
                    checked={permissions[p.key as keyof typeof permissions]}
                    onCheckedChange={v => setPermissions(prev => ({ ...prev, [p.key]: v }))}
                  />
                  <span className="text-sm text-muted-foreground">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAddAdmin} disabled={!newEmail.trim() || adding} className="gap-2">
            <UserPlus className="w-4 h-4" />
            {adding ? 'Adding...' : 'Grant Admin Access'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-serif text-lg text-foreground">Current Admins</h3>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : admins.length === 0 ? (
          <p className="text-muted-foreground text-sm">No admins configured yet.</p>
        ) : (
          admins.map(admin => (
            <Card key={admin.id} className="hover:border-accent/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      {admin.is_super_admin
                        ? <ShieldCheck className="w-4 h-4 text-primary" />
                        : <Shield className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground">{admin.email}</p>
                        {admin.is_super_admin && (
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            Super Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {!admin.is_super_admin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-1 h-7 text-xs shrink-0">
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove admin access?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will revoke all admin privileges for {admin.email}. They will lose access to the admin dashboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveAdmin(admin)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove Access
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                {!admin.is_super_admin && (
                  <div className="mt-4 flex flex-col gap-3 pl-12">
                    {[
                      { key: 'can_approve_reject', label: 'Approve / reject book submissions' },
                      { key: 'can_manage_coupons', label: 'Manage coupon codes' },
                      { key: 'can_manage_admins', label: 'Manage other admins' },
                    ].map(p => (
                      <div key={p.key} className="flex items-center gap-3">
                        <Switch
                          checked={admin[p.key as keyof AdminRecord] as boolean}
                          onCheckedChange={v => handleUpdatePermissions(admin.id, p.key, v)}
                        />
                        <span className="text-sm text-muted-foreground">{p.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
