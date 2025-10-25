import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import UserList, { User } from "@/components/UserList";
import UserPanel from "@/components/UserPanel";

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [panelMode, setPanelMode] = useState<"add" | "edit">("add");

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  const handleAddUser = () => {
    setPanelMode("add");
    setEditingUser(null);
    setIsPanelOpen(true);
  };

  const handleEditUser = (user: User) => {
    setPanelMode("edit");
    setEditingUser(user);
    setIsPanelOpen(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (panelMode === "add") {
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
      };
      setUsers([...users, newUser]);
      toast.success("User added successfully!");
    } else {
      setUsers(
        users.map((user) =>
          user.id === editingUser?.id ? { ...user, ...userData } : user
        )
      );
      toast.success("User updated successfully!");
    }
    setIsPanelOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    localStorage.setItem(
      "users",
      JSON.stringify(users.filter((user) => user.id !== id))
    );
    toast.success("User deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Users List</h2>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their information
            </p>
          </div>
          <Button
            onClick={handleAddUser}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <UserList
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </main>

      <UserPanel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editUser={editingUser}
        mode={panelMode}
      />
    </div>
  );
};

export default Index;
