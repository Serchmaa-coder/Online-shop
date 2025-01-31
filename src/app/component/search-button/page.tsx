'use client';
import styles from './page.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBtn() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search-result-page?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{ position: 'fixed', top: '0', zIndex: '1000' }}>
      <div className={styles['search-section']}>
        <form onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Search.."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles['search-input']}
          />
          <button type="submit" className={styles.searchBtn}>
            <SearchOutlined />
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
