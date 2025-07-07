import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ChefHat, 
  Settings, 
  BarChart3,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

export default function AdminPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Total Recipes",
      value: "3,892",
      change: "+8%",
      icon: <ChefHat className="h-6 w-6" />
    },
    {
      title: "Active Sessions",
      value: "156",
      change: "+23%",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Reports",
      value: "12",
      change: "-2%",
      icon: <Settings className="h-6 w-6" />
    }
  ];

  const recentRecipes = [
    { id: 1, title: "Spicy Thai Curry", author: "John Doe", status: "pending", date: "2024-01-15" },
    { id: 2, title: "Classic Carbonara", author: "Jane Smith", status: "approved", date: "2024-01-14" },
    { id: 3, title: "Vegan Buddha Bowl", author: "Mike Johnson", status: "pending", date: "2024-01-13" },
  ];

  const recentUsers = [
    { id: 1, name: "Alice Brown", email: "alice@example.com", joined: "2024-01-15", recipes: 3 },
    { id: 2, name: "Bob Wilson", email: "bob@example.com", joined: "2024-01-14", recipes: 1 },
    { id: 3, name: "Carol Davis", email: "carol@example.com", joined: "2024-01-13", recipes: 7 },
  ];

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, recipes, and platform settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="text-brand-primary">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Recipes */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Recent Recipes
                </span>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipe
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRecipes.map((recipe) => (
                  <div key={recipe.id} className="flex items-center justify-between p-4 bg-surface-soft rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                      <p className="text-sm text-gray-600">by {recipe.author} • {recipe.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={recipe.status === 'approved' ? 'default' : 'secondary'}
                        className={recipe.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {recipe.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Users
                </span>
                <Button size="sm" variant="outline">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-surface-soft rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Joined {user.joined} • {user.recipes} recipes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 