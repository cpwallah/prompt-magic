import { Button } from "./ui/button";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
export function Appbar(){
    return(
        <div className="flex justify-between px-2 py-1">
            <div>Bolty</div>
            <div>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            </div>
        </div>
    )
}