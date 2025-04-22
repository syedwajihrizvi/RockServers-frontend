import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import "../styles/dropdown.css";
import { Link } from "react-router-dom";

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
					<Link to="/dashboard/account">
						<DropdownMenu.Item className="DropdownMenuItem">
							My Account
						</DropdownMenu.Item>
					</Link>
					<Link to="/dashboard/friends">
						<DropdownMenu.Item className="DropdownMenuItem">
							My Friends
						</DropdownMenu.Item>
					</Link>
					<Link to="/dashboard/posts">
						<DropdownMenu.Item className="DropdownMenuItem">
							My Posts
						</DropdownMenu.Item>
					</Link>
					<Link to="/dashboard/discussions">
						<DropdownMenu.Item className="DropdownMenuItem">
							My Discussions
						</DropdownMenu.Item>
					</Link>
					<Link to="dashboard/notifications">
						<DropdownMenu.Item className="DropdownMenuItem">
							Notifications
						</DropdownMenu.Item>
					</Link>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default DropdownMenuDemo;
