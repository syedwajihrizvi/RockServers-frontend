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
					<Link to="/dashboard/settings" style={{textDecoration: 'none'}}>
						<DropdownMenu.Item className="DropdownMenuItem">
							Settings
						</DropdownMenu.Item>
					</Link>
					<Link to="/dashboard/followers" style={{textDecoration: 'none'}}>
						<DropdownMenu.Item className="DropdownMenuItem">
							Followers
						</DropdownMenu.Item>
					</Link>
					<Link to="/dashboard/following" style={{textDecoration: 'none'}}>
						<DropdownMenu.Item className="DropdownMenuItem">
							Following
						</DropdownMenu.Item>
					</Link>
					<Link to="/dashboard/posts" style={{textDecoration: 'none'}}>
						<DropdownMenu.Item className="DropdownMenuItem">
							My Posts
						</DropdownMenu.Item>
					</Link>
					<Link to="dashboard/notifications" style={{textDecoration: 'none'}}>
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
