import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  ChefHat, 
  Heart, 
  Edit,
  Settings
} from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
    joinDate: "January 2024",
    totalRecipes: 12,
    favoriteRecipes: 45,
    menuItems: 6
  };

  const achievements = [
    { name: "Recipe Creator", description: "Created your first recipe", earned: true },
    { name: "Community Star", description: "5 recipes liked by others", earned: true },
    { name: "Menu Master", description: "Planned 10 weekly menus", earned: false },
    { name: "Explorer", description: "Tried 50 different recipes", earned: false },
  ];

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-brand-secondary text-brand-primary text-2xl">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>
                </div>

                <Button className="bg-gradient-brand hover:bg-brand-primary text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-brand-primary mb-2">
                  <ChefHat className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{user.totalRecipes}</div>
                <div className="text-sm text-gray-600">Recipes Created</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-brand-primary mb-2">
                  <Heart className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{user.favoriteRecipes}</div>
                <div className="text-sm text-gray-600">Favorite Recipes</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-brand-primary mb-2">
                  <Settings className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{user.menuItems}</div>
                <div className="text-sm text-gray-600">Menu Items</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.earned
                        ? 'border-brand-primary bg-surface-soft'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      {achievement.earned && (
                        <Badge className="bg-brand-primary text-white">
                          Earned
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-soft rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about new recipes and features</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-surface-soft rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                    <p className="text-sm text-gray-600">Manage who can see your recipes and profile</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-surface-soft rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Delete Account</h4>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 