import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, FileText, Users, Calendar, Search } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: "Bắt đầu",
        question: "Làm thế nào để tìm kiếm môn học?",
        answer: "Bạn có thể sử dụng thanh tìm kiếm ở đầu trang. Nhập tên môn học, mã môn học hoặc tên giảng viên để tìm kiếm. Kết quả sẽ hiển thị ngay lập tức.",
    },
    {
        category: "Bắt đầu",
        question: "Làm sao để thêm môn học vào thời khóa biểu?",
        answer: "Sau khi tìm thấy môn học, click vào môn học đó. Chọn nhóm lớp phù hợp và click nút 'Thêm vào TKB'. Môn học sẽ được thêm vào thời khóa biểu của bạn.",
    },
    {
        category: "Thời khóa biểu",
        question: "Làm thế nào để xóa môn học khỏi thời khóa biểu?",
        answer: "Click vào môn học trong thời khóa biểu của bạn, sau đó chọn 'Xóa' hoặc click vào biểu tượng X ở góc môn học.",
    },
    {
        category: "Thời khóa biểu",
        question: "Tôi có thể lưu thời khóa biểu của mình không?",
        answer: "Có, thời khóa biểu của bạn được tự động lưu trong trình duyệt. Bạn cũng có thể xuất thời khóa biểu ra file hoặc chụp ảnh màn hình để lưu trữ.",
    },
    {
        category: "Trùng lịch",
        question: "Hệ thống có cảnh báo khi môn học bị trùng lịch không?",
        answer: "Có, khi bạn thêm môn học bị trùng giờ với môn đã có, hệ thống sẽ hiển thị cảnh báo màu đỏ và thông báo cho bạn biết.",
    },
    {
        category: "Trùng lịch",
        question: "Tôi có thể thêm môn học trùng lịch không?",
        answer: "Có, bạn vẫn có thể thêm nhưng hệ thống sẽ cảnh báo. Điều này hữu ích khi bạn muốn xem nhiều phương án trước khi quyết định.",
    },
    {
        category: "Tài khoản",
        question: "Tôi có cần tạo tài khoản không?",
        answer: "Không bắt buộc. Bạn có thể sử dụng hầu hết các tính năng mà không cần đăng nhập. Tuy nhiên, việc đăng nhập giúp đồng bộ dữ liệu trên nhiều thiết bị.",
    },
    {
        category: "Tài khoản",
        question: "Dữ liệu của tôi có được bảo mật không?",
        answer: "Có, dữ liệu thời khóa biểu của bạn được lưu an toàn và chỉ bạn mới có thể truy cập. Chúng tôi không chia sẻ thông tin cá nhân của bạn.",
    },
];

export default function Guide() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-4 rounded-full">
                            <BookOpen className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Hướng Dẫn & Tài Liệu</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Tìm câu trả lời cho các câu hỏi thường gặp về hệ thống thời khóa biểu</p>
                </div>

                {/* FAQ Section – không filter, show hết */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="w-6 h-6" />
                            Câu hỏi thường gặp
                        </CardTitle>
                        <CardDescription>Các câu hỏi phổ biến và câu trả lời chi tiết</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                                    <button onClick={() => toggleFAQ(index)} className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center">
                                        <div className="flex-1">
                                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded mb-2">{faq.category}</span>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                                        </div>
                                        {openIndex === index ? <ChevronUp className="w-5 h-5 text-gray-500 ml-4 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 ml-4 shrink-0" />}
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                                            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="mt-8">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">Không tìm thấy câu trả lời?</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Liên hệ với chúng tôi để được hỗ trợ trực tiếp</p>
                            <Button size="lg">Liên hệ hỗ trợ</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
