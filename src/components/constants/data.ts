
import { Icons } from "../icons";


export interface SidebarItem {
    title: string;
    url: string;
    disabled?: boolean;
    external?: boolean;
    icon?: keyof typeof Icons;
    label?: string;
    description?: string;
    isActive?: boolean;
    items?: SidebarItem[];
  }
export interface Role{
  role:string;
  roleItems:SidebarItem[];
}
  

  export const sideBarItems: Role[] = [

    {
      role:'agent',
      roleItems:[
        {
          title: 'Ag-Dashboard',
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
        {
          title: 'Reports',
          url: '/dashboard',
          icon: 'reports',
          isActive: false,
          items: [] // No child items
        }

      ]      
    },
    {
      role:'supplier',
      roleItems:[
        {
          title: 'Sup-Dashboard',
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
        {
          title: 'Reports',
          url: '/dashboard',
          icon: 'reports',
          isActive: false,
          items: [] // No child items
        }

      ]      
    },
    {
      role:'admin',
      roleItems:[
        {
          title: 'Ad-Dashboard',
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
        {
          title: 'Reports',
          url: '/dashboard',
          icon: 'reports',
          isActive: false,
          items: [] // No child items
        }

      ]      
    },
    {
      role:'super-admin',
      roleItems:[
        {
          title: 'Sup-Dashboard',
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
        {
          title: 'Reports',
          url: '/dashboard',
          icon: 'reports',
          isActive: false,
          items: [] // No child items
        }

      ]      
    },

      
  
    



    // {
    //   title: 'Dashboard',
    //   url: '/dashboard/',
    //   icon: 'dashboard',
    //   isActive: false,
    //   items: [] // Empty array as there are no child items for Dashboard
    // },
    // {
    //   title: 'Booking',
    //   url: '/dashboard/',
    //   icon: 'car',
    //   isActive: false,
    //   items: [] // No child items
    // },
    // {
    //   title: 'Voucher',
    //   url: '/dashboard/',
    //   icon: 'page',
    //   isActive: false,
    //   items: [] // No child items
    // },
    // {
    //   title: 'Invoice',
    //   url: '/dashboard/',
    //   icon: 'billing',
    //   isActive: false,
    //   items: [] // No child items
    // },
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
    // {
    //   title: 'Reports',
    //   url: '/dashboard',
    //   icon: 'reports',
    //   isActive: false,
    //   items: [] // No child items
    // }
  ];


  // export const sideBarItems: SidebarItem[] = [
  //   {
  //     title: 'Dashboard',
  //     url: '/dashboard/',
  //     icon: 'dashboard',
  //     isActive: false,
  //     items: [] // Empty array as there are no child items for Dashboard
  //   },
  //   {
  //     title: 'Booking',
  //     url: '/dashboard/',
  //     icon: 'car',
  //     isActive: false,
  //     items: [] // No child items
  //   },
  //   {
  //     title: 'Voucher',
  //     url: '/dashboard/',
  //     icon: 'page',
  //     isActive: false,
  //     items: [] // No child items
  //   },
  //   {
  //     title: 'Invoice',
  //     url: '/dashboard/',
  //     icon: 'billing',
  //     isActive: false,
  //     items: [] // No child items
  //   },
  //   // {
  //   //   title: 'Account',
  //   //   url: '#', // Placeholder as there is no direct link for the parent
  //   //   icon: 'user',
  //   //   isActive: true,
  
  //   //   items: [
  //   //     {
  //   //       title: 'Profile',
  //   //       url: '/dashboard',
  //   //       icon: 'userPen'
  //   //     },
  //   //     {
  //   //       title: 'Login',
  //   //       url: '/',
  //   //       icon: 'login'
  //   //     }
  //   //   ]
  //   // },
  //   {
  //     title: 'Reports',
  //     url: '/dashboard',
  //     icon: 'reports',
  //     isActive: false,
  //     items: [] // No child items
  //   }
  // ];