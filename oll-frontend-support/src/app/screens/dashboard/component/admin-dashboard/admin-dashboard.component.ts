import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { AuthService } from 'src/app/screens/auth/services/auth.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  expertUsersData: any = {
    activeCount: 0,
    totalCount: 0,
    users: [],
  };
  supportUsersData: any = {
    activeCount: 0,
    totalCount: 0,
    users: [],
  };
  selectedMeetingFilter = 1;
  pageSize = 10;
  scrollReachedBottom = false;
  currentPage = 1;
  expertSupportView: boolean = true;
  is_admin: boolean = false;
  @Output() supportUserId = new EventEmitter<string>();
  userAuditDetails: any = [];

  constructor(
    public dataService: DataService,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUserValue?.token) {
      const userDetails = this.dataService.userDetails;
      if (userDetails.is_admin_user) {
        this.is_admin = true;
      }
    }
    this.getUserList();
  }

  getUserList() {
    try {
      this.dashboardService.getUserList().subscribe((res: any) => {
        if (res) {
          this.supportUsersData.users = res.primary.users;
          this.supportUsersData.activeCount = res.primary.active;
          this.supportUsersData.totalCount = res.primary.total;

          this.expertUsersData.users = res.nonPrimary.users;
          this.expertUsersData.activeCount = res.nonPrimary.active;
          this.expertUsersData.totalCount = res.nonPrimary.total;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  showLogOutConfirmation(userObj) {
    Swal.fire({
      title: `Are you sure you want to logout ${userObj.first_name} ${userObj.last_name}?`,
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: '#fff',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#da2128',
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const text = document.querySelector('.swal2-title');
        const btnContainer = document.querySelector('.swal2-actions');
        const confirmButton = document.querySelector('.swal2-confirm');
        const cancelButton = document.querySelector('.swal2-cancel');

        if (confirmButton && cancelButton) {
          btnContainer.setAttribute('style', 'margin-bottom: 10px;'),
            confirmButton.setAttribute(
              'style',
              'border-radius: 18px; width: 100px; background-color: #da2128; color: #fff; border:none; padding:8px 10px; margin-left: 20px;'
            );
          cancelButton.setAttribute(
            'style',
            'border-radius: 18px; width: 100px; background-color: #fff; color: #da2128; border: 1px solid #da2128; padding:8px 10px;'
          );
          text.setAttribute(
            'style',
            'color: #000; margin: 10px 0; display: flex; justify-content: center; align-items: center'
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.logoffUser(userObj);
      }
    });
  }

  logoffUser(userDetails) {
    const payload: any = {
      user_id: userDetails?.user_id,
      user_name: userDetails?.user_name,
    };
    this.dashboardService.logoutUserByAdmin(payload).subscribe((res) => {
      if (res && res.message) {
        this.getUserList();
        this.toastrService.success(res?.message);
      } else {
        this.toastrService.error('Something went wrong!');
      }
    });
  }

  onScroll(event: any): void {
    this.scrollReachedBottom = this.isScrollbarAtBottom(event);
    if (this.scrollReachedBottom) {
      this.currentPage += 1;
      // this.meetingHistory(this.userDetails?.user_id);
    }
  }

  private isScrollbarAtBottom(event): boolean {
    const { scrollHeight, scrollTop, clientHeight } = event.target;

    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
      return true;
    }
    return false;
  }

  showUserDetails(userId) {
    if (this.is_admin) {
      const payload = {
        duration_type: this.selectedMeetingFilter,
        page_size: this.pageSize,
        current_page: this.currentPage,
        userId: userId,
      };
      this.dashboardService.getAuditByUser(payload).subscribe(
        (res: any) => {
          this.userAuditDetails = res.data;
          this.resetScrollBottomLoader();
        },
        (err) => {
          this.resetScrollBottomLoader();
        }
      );
    }
  }

  resetScrollBottomLoader() {
    setTimeout(() => {
      this.scrollReachedBottom = false;
    }, 500);
  }

  changeScreen(userId) {
    this.supportUserId.emit(userId);
    this.expertSupportView = false;
  }
}
