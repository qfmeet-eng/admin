import {Link} from 'react-router-dom';
export default function Sidebar()
{
return ( <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
    <Link className="sidebar-brand d-flex align-items-center justify-content-center" 
        to="/dashboard">
        <div className="sidebar-brand-text mx-3">fresh Cart</div>
    </Link>
    <hr className="sidebar-divider my-0" />
    <li className="nav-item">
        <Link className="nav-link" to="/dashboard">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span>Dashboard</span></Link>
    </li>
    
    <hr className="sidebar-divider" />
    
    <li className="nav-item active">
        <Link className="nav-link" to="/adminCategory">
            <span>Categories</span></Link>
    </li>
    <li className="nav-item active">
        <Link className="nav-link" to="/adminSubCategory">
            <span>SubCategories</span></Link>
    </li>
    <li className="nav-item active">
        <Link className="nav-link" to="/adminProduct">
            <span>Products</span></Link>
    </li>
    <li className="nav-item active">
        <Link className="nav-link" to="/adminUser">
            <span>Users</span></Link>
    </li>
    
    
 
    <hr className="sidebar-divider d-none d-md-block" />
     
    <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle" />
    </div>
</ul>);
}