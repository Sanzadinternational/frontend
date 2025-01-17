
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
          title: 'Agent-Dashboard',
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
          title: 'Supplier-Dashboard',
          url: '#',
          icon: 'dashboard',
          isActive: false,
          items: [] // Empty array as there are no child items for Dashboard
        },
        {
          title: 'Vehicles',
          url: '#',
           icon: 'car',
          isActive: true,
          items: [
            {
              title: 'Available Vehicles',
              url: '/dashboard/supplier/vehicles',
              icon: 'car',
            },
            {
              title: 'Add New Vehicle',
              url: '/dashboard/supplier/AddVehicle',
              icon: 'car',
            }
          ] // No child items
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
          title: 'Admin-Dashboard',
          url: '#',
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
      role:'superadmin',
      roleItems:[
        {
          title: 'Super Admin-Dashboard',
          url: '#',
          icon: 'dashboard',
          isActive: false,
          items: [] // Empty array as there are no child items for Dashboard
        },
        {
          title: 'Admin',
          url: '#',
           icon: 'car',
          isActive: true,
          items: [
            {
              title:'Add Admin',
              url:'/dashboard/superadmin/add-admin',
              icon:'userPen'
            }
          ] // No child items
        },
        {
          title: 'Agent',
          url: '#',
          icon: 'page',
          isActive: false,
          items: [] // No child items
        },
        {
          title: 'Supplier',
          url: '#',
          icon: 'billing',
          isActive: false,
          items: [] // No child items
        },
        {
          title: 'Reports',
          url: '#',
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