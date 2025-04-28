
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
    show?: string;
    items?: SidebarItem[];
}

export interface Role {
  role: string;
  roleItems: SidebarItem[];
}

export const sideBarItems: Role[] = [
  {
    role: 'agent',
    roleItems: [
      {
        title: 'Agent-Dashboard',
        url: '/dashboard/agent',
        icon: 'dashboard',
        isActive: false
      },
      {
        title: 'Booking',
        url: '#',
        icon: 'booking',
        isActive: false
      },
      {
        title: 'Voucher',
        url: '#',
        icon: 'page',
        isActive: false
      },
      {
        title: 'Invoice',
        url: '#',
        icon: 'billing',
        isActive: false
      },
      {
        title: 'Reports',
        url: '#',
        icon: 'reports',
        isActive: false
      }
    ]      
  },
  {
    role: 'supplier',
    roleItems: [
      {
        title: 'Supplier-Dashboard',
        url: '/dashboard/supplier',
        icon: 'dashboard',
        isActive: false
      },
      {
        title: 'Vehicles',
        url: '#',
        icon: 'car',
        isActive: true,
        items: [
          {
            title: 'Add Vehicle',
            url: '/dashboard/supplier/VehicleDetails',
            icon: 'car'
          },
          {
            title: 'Add Zone',
            url: '/dashboard/supplier/AddZone',
            icon: 'car'
          },
          {
            title: 'Add Transfer',
            url: '/dashboard/supplier/VehicleTransfer',
            icon: 'car'
          },
         
          {
            title: 'Add Surcharge',
            url: '/dashboard/supplier/AddSurcharge',
            icon: 'car'
          }
        ]
      },
      {
        title: 'Booking',
        url: '#',
        icon: 'booking',
        isActive: false
      },
      {
        title: 'Voucher',
        url: '#',
        icon: 'page',
        isActive: false
      },
      {
        title: 'Invoice',
        url: '#',
        icon: 'billing',
        isActive: false
      },
      {
        title: 'Reports',
        url: '#',
        icon: 'reports',
        isActive: false
      }
    ]      
  },
  {
    role: 'admin',
    roleItems: [
      {
        title: 'Admin-Dashboard',
        url: '/dashboard/admin',
        icon: 'dashboard',
        isActive: false,
        items: []
      },
      {
        title: 'Accounts',
        url: '#',
        icon: 'reports',
        isActive: false,
        items: [
          {
            title: 'Agent Accounts',
            url: '/dashboard/admin/agent-accounts',
            icon: 'reports',
            show: 'AgentAccount' // Will check userData.AgentAccount
          },
          {
            title: 'Supplier Accounts',
            url: '/dashboard/admin/supplier-accounts',
            icon: 'reports',
            show: 'SupplierAccount' // Will check userData.SupplierAccount
          }
        ]
      },
      {
        title: 'Operation',
        url: '#',
        icon: 'settings',
        isActive: false,
        items: [
          {
            title: 'Agent Operations',
            url: '/dashboard/admin/all-agent',
            icon: 'settings',
            show: 'AgentOperation' // Will check userData.AgentOperation
          },
          {
            title: 'Supplier Operations',
            url: '/dashboard/admin/all-supplier',
            icon: 'settings',
            show: 'SupplierOpration' // Will check userData.SupplierOpration
          }
        ]
      },
      {
        title: 'Product',
        url: '#',
        icon: 'entry',
        isActive: false,
        items: [
          {
            title: 'Agent Products',
            url: '#',
            icon: 'entry',
            show: 'Agent_product' // Will check userData.Agent_product
          },
          {
            title: 'Supplier Products',
            url: '/dashboard/admin/vehicle-details',
            icon: 'entry',
            show: 'Supplier_product' // Will check userData.Supplier_product
          }
        ]
      }
    ]      
  },
  {
    role: 'superadmin',
    roleItems: [
      {
        title: 'Super Admin-Dashboard',
        url: '/dashboard/admin',
        icon: 'dashboard',
        isActive: false
      },
      {
        title: 'Agent',
        url: '#',
        icon: 'user',
        isActive: true,
        items: [
          {
            title: 'Available Agent',
            url: '/dashboard/admin/all-agent',
            icon: 'add'
          }
        ]
      },
      {
        title: 'Supplier',
        url: '#',
        icon: 'user',
        isActive: true,
        items: [
          {
            title: 'Available Supplier',
            url: '/dashboard/admin/all-supplier',
            icon: 'add'
          },
          {
            title: 'Add Margin',
            url: '/dashboard/admin/add-margin',
            icon: 'add'
          },
          {
            title: 'Vehicle Details',
            url: '/dashboard/admin/vehicle-details',
            icon: 'add'
          }
        ]
      },
      {
        title: 'Admin',
        url: '#',
        icon: 'user',
        isActive: true,
        items: [
          {
            title: 'All Admin',
            url: '/dashboard/admin/all-admin',
            icon: 'add'
          },
          {
            title: 'Add Admin',
            url: '/dashboard/admin/add-admin',
            icon: 'userPen'
          }
        ]
      },
      {
        title: 'Booking',
        url: '/dashboard/admin/all-booking',
        icon: 'reports',
        isActive: false
      }
    ]      
  }
];

