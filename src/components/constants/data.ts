import { Icons } from "../icons";


export interface NavItem {
    title: string;
    url: string;
    disabled?: boolean;
    external?: boolean;
    icon?: keyof typeof Icons;
    label?: string;
    description?: string;
    isActive?: boolean;
    items?: NavItem[];
  }



  export const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: '/dashboard/',
      icon: 'dashboard',
      isActive: false,
      items: [] // Empty array as there are no child items for Dashboard
    },
    {
      title: 'Booking',
      url: '/dashboard/',
      icon: 'car',
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Voucher',
      url: '/dashboard/',
      icon: 'page',
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Invoice',
      url: '/dashboard/',
      icon: 'billing',
      isActive: false,
      items: [] // No child items
    },
    // {
    //   title: 'Account',
    //   url: '#', // Placeholder as there is no direct link for the parent
    //   icon: 'user',
    //   isActive: true,
  
    //   items: [
    //     {
    //       title: 'Profile',
    //       url: '/dashboard',
    //       icon: 'userPen'
    //     },
    //     {
    //       title: 'Login',
    //       url: '/',
    //       icon: 'login'
    //     }
    //   ]
    // },
    {
      title: 'Reports',
      url: '/dashboard',
      icon: 'reports',
      isActive: false,
      items: [] // No child items
    }
  ];