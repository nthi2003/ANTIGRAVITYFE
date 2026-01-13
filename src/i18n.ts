import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    vi: {
        translation: {
            "dashboard": "Bảng điều khiển",
            "goals": "Mục tiêu nhóm",
            "report": "Báo cáo",
            "profile": "Cá nhân",
            "add_transaction": "Nhập chi tiêu",
            "language": "Ngôn ngữ",
            "logout": "Đăng xuất",
            "update_profile": "Cập nhật hồ sơ",
            "full_name": "Họ và tên",
            "email": "Email",
            "save_changes": "Lưu thay đổi",
            "coming_soon": "Sắp ra mắt",
            "discipline_is_freedom": "Kỷ luật là tự do",
            "good_morning": "Chào buổi sáng",
            "health_score": "Điểm sức khỏe",
            "at_risk": "Đang gặp rủi ro",
            "stable": "Ổn định",
            "excellent": "Tuyệt vời",
            "recent_activity": "Hoạt động gần đây",
            "confirm": "Xác nhận",
            "income": "Thu nhập",
            "expense": "Chi tiêu",
            "categories": {
                "food": "Ăn uống",
                "rent": "Tiền nhà",
                "transport": "Di chuyển",
                "shopping": "Mua sắm",
                "salary": "Lương/Thu nhập"
            }
        }
    },
    en: {
        translation: {
            "dashboard": "Dashboard",
            "goals": "Group Goals",
            "report": "Reports",
            "profile": "Profile",
            "add_transaction": "Record Spending",
            "language": "Language",
            "logout": "Logout",
            "update_profile": "Update Profile",
            "full_name": "Full Name",
            "email": "Email",
            "save_changes": "Save Changes",
            "coming_soon": "Coming Soon",
            "discipline_is_freedom": "Discipline is freedom",
            "good_morning": "Good Morning",
            "health_score": "Health Score",
            "at_risk": "At Risk",
            "stable": "Stable",
            "excellent": "Excellent",
            "recent_activity": "Recent Activity",
            "confirm": "Confirm",
            "income": "Income",
            "expense": "Expense",
            "categories": {
                "food": "Food & Drink",
                "rent": "Rent",
                "transport": "Transport",
                "shopping": "Shopping",
                "salary": "Salary / Income"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
