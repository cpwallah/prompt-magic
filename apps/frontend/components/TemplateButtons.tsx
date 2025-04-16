import { Button } from "./ui/button";

export function TemplateButtons(){
    return (
        <div className="flex gap-2" >
            <span className="cursor-pointer border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100"><Button variant="outline">Build a chess app</Button></span>
            <span className="cursor-pointer border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100"><Button variant="outline">Build a todo app</Button></span>
            <span className="cursor-pointer border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100"><Button variant="outline">Build a docs app</Button></span>
            <span className="cursor-pointer border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100"><Button variant="outline">Create a base app</Button></span>


        </div>
    )
}