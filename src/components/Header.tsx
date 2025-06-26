
import React from "react";
import { Zap, User, Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NavigationItems from "./NavigationItems";

interface HeaderProps {
  userData?: any;
  onLogout?: () => void;
}

const Header = ({ userData, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 flex items-center gap-2">
                <Zap size={24} className="text-energy-green" />
                <span className="font-bold text-xl">EnergyChain</span>
              </div>
              <div className="px-2">
                <NavigationItems mobile />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Zap size={24} className="text-energy-green" />
            <span className="font-bold text-xl hidden md:inline-flex">
              EnergyChain
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          <NavigationItems />
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-energy text-white">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {userData && (
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
              )}
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
