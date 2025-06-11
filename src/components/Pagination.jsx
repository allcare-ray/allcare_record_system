import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 否则显示当前页附近的页码
      let startPage = Math.max(1, currentPage - 3);
      let endPage = Math.min(totalPages, currentPage + 3);

      // 调整起始和结束页码以确保显示足够的页码
      if (endPage - startPage < maxVisiblePages - 1) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }

      // 添加第一页和省略号
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 添加省略号和最后一页
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center space-y-4 py-6 bg-white">
      {/* 统计信息和每页显示条数选择 */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
        <div className="text-sm text-gray-600">
          显示第 <span className="font-semibold text-gray-900">{startItem}</span> 到{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> 条，共{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> 条记录
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">每页显示:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">条</span>
        </div>
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          {/* 上一页按钮 */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
              ${currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                : 'border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white'
              }
            `}
            title="上一页"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* 页码按钮 */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-10 h-10">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-medium transition-all duration-200
                    ${page === currentPage
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                    }
                  `}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* 下一页按钮 */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
              ${currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                : 'border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white'
              }
            `}
            title="下一页"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      )}

      {/* 移动端简化版 */}
      <div className="flex sm:hidden items-center space-x-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
            ${currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white'
            }
          `}
        >
          上一页
        </button>

        <span className="text-sm text-gray-600">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
            ${currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white'
            }
          `}
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default Pagination;
