"use client";

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <>
      <header className="fixed top-0 z-50 w-full transition-colors duration-300 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-11 w-auto" />
          </Link>

          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-5">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/#our-server" className={navigationMenuTriggerStyle()}>
                            Our Server
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                  <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                          <Link href="/#gallery" className={navigationMenuTriggerStyle()}>
                              Gallery
                          </Link>
                      </NavigationMenuLink>
                  </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="https://brassworks.opnsoc.org/map" className={navigationMenuTriggerStyle()}>
                      Live Map
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                      <Link href="/roadmap" className={navigationMenuTriggerStyle()}>
                          Roadmap
                      </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="items-center hidden md:flex ml-20">
            <Link target="_blank" href="https://discord.gg/neqEBnPVgY">
              <Button variant="default" className="font-minecraft relative mb-1 inline-flex items-center justify-center gap-x-2
                px-3.5 py-1.5 text-sm ring-2 ring-inset
                border-amber-600 bg-amber-500 text-white
                shadow-[0_4px_theme(colors.amber.600)]
                ring-amber-400
                hover:translate-y-0.5 hover:bg-amber-400
                hover:shadow-[0_2px_theme(colors.amber.500)]
                hover:ring-amber-300
                forced-colors:[--btn-icon:ButtonText]
                forced-colors:data-hover:[--btn-icon:ButtonText]">
                Play Now
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="https://brassworks.opnsoc.org/map" className="px-2 py-1 rounded-md hover:bg-muted">
                    Live Map
                  </Link>
                  <Link href="/roadmap" className="px-2 py-1 rounded-md hover:bg-muted">
                    Roadmap
                  </Link>
                  <div className="flex flex-col gap-2 mt-4">
                    <Link href="/play-now">
                      <Button variant="default" className="font-minecraft relative mb-1 inline-flex items-center justify-center gap-x-2
                        px-3.5 py-1.5 text-sm ring-2 ring-inset
                        border-amber-600 bg-amber-500 text-white
                        shadow-[0_4px_theme(colors.amber.600)]
                        ring-amber-400
                        hover:translate-y-0.5 hover:bg-amber-400
                        hover:shadow-[0_2px_theme(colors.amber.500)]
                        hover:ring-amber-300
                        forced-colors:[--btn-icon:ButtonText]
                        forced-colors:data-hover:[--btn-icon:ButtonText]">
                        Play Now
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";