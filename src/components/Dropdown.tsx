import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import "../styles/dropdown.css";

const DropdownMenuDemo = () => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button className="IconButton" aria-label="Customise options">
					<HamburgerMenuIcon color="#03fc98"/>
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
					<DropdownMenu.Item className="DropdownMenuItem">
						My Account
					</DropdownMenu.Item>
					<DropdownMenu.Item className="DropdownMenuItem">
						My Friends
					</DropdownMenu.Item>
					<DropdownMenu.Item className="DropdownMenuItem">
						My Sessions
					</DropdownMenu.Item>
					<DropdownMenu.Item className="DropdownMenuItem">
						Messages
					</DropdownMenu.Item>
					<DropdownMenu.Item className="DropdownMenuItem">
						Schedule
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default DropdownMenuDemo;
