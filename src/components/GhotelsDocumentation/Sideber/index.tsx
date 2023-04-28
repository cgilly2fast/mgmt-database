import { Link } from 'react-router-dom';
import './sidebar.css';
import {
  MenuItem,
  ProSidebar,
  Menu,
  SidebarContent,
  SubMenu,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

export default function Sidebar() {
  return (
    <div id="header">
      <ProSidebar>
        <SidebarContent style={{ background: '#f1f1f1' }}>
          <Menu iconShape="square">
            <MenuItem>
              <Link to="/documentation" style={{ color: '#000' }}>
                Get Start
              </Link>
            </MenuItem>

            <SubMenu title="Usage">
              <MenuItem className="dropdown-menu-list mb-3">
                <Link to="/documentation/function" style={{ color: '#000' }}>
                  Function
                </Link>
              </MenuItem>
              <SubMenu title="GHotels-web">
                <MenuItem>
                  <Link
                    to="/documentation/ghotels/overview"
                    style={{ color: '#000' }}
                  >
                    Overview
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/documentation/ghotels/signup"
                    style={{ color: '#000' }}
                  >
                    SignUp
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/documentation/ghotels/rooms"
                    style={{ color: '#000' }}
                  >
                    Room Book
                  </Link>
                </MenuItem>
                <SubMenu title=" Third Party">
                  <MenuItem>
                    <Link
                      to="/documentation/ghotels/thirdparty/stripe"
                      style={{ color: '#000' }}
                    >
                      Stripe
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/documentation/ghotels/thirdparty/persona"
                      style={{ color: '#000' }}
                    >
                      Persona
                    </Link>
                  </MenuItem>
                </SubMenu>
              </SubMenu>

              <SubMenu title="Mgmt-web">
                <MenuItem>
                  <Link
                    to="/documentation/mgmt/overview"
                    style={{ color: '#000' }}
                  >
                    Overview
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/documentation/mgmt/signup"
                    style={{ color: '#000' }}
                  >
                    SignUp
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/documentation/mgmt/hospitable"
                    style={{ color: '#000' }}
                  >
                    Hospitable
                  </Link>
                </MenuItem>
              </SubMenu>

              <MenuItem>
                <Link to="/documentation/alias" style={{ color: '#000' }}>
                  Alias
                </Link>
              </MenuItem>
            </SubMenu>
            <MenuItem>
              <Link to="/" style={{ color: '#000' }}>
                Back to Mgmt-Panle
              </Link>
            </MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </div>
  );
}
