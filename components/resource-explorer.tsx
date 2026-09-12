'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  resourceTypeLabels,
  type LearningResource,
  type ResourceType,
} from '@/lib/resources';

type ResourceFilter = 'all' | ResourceType;

const filterLabels: Record<ResourceFilter, string> = {
  all: '全部资源',
  ...resourceTypeLabels,
};

const resourceTypes = Object.keys(resourceTypeLabels) as ResourceType[];

function resourceTypeFromLocation(): ResourceFilter {
  if (typeof window === 'undefined') return 'all';
  const requested = new URLSearchParams(window.location.search).get('resource');
  return requested && resourceTypes.includes(requested as ResourceType)
    ? requested as ResourceType
    : 'all';
}

export default function ResourceExplorer({ resources }: { resources: LearningResource[] }) {
  const [filter, setFilter] = useState<ResourceFilter>('all');

  useEffect(() => {
    function syncFilterFromLocation() {
      setFilter(resourceTypeFromLocation());
    }

    syncFilterFromLocation();
    window.addEventListener('popstate', syncFilterFromLocation);
    return () => window.removeEventListener('popstate', syncFilterFromLocation);
  }, []);

  const visibleResources = useMemo(
    () => resources.filter((resource) => filter === 'all' || resource.type === filter),
    [filter, resources],
  );

  function selectFilter(nextFilter: ResourceFilter) {
    setFilter(nextFilter);
    const url = new URL(window.location.href);
    if (nextFilter === 'all') url.searchParams.delete('resource');
    else url.searchParams.set('resource', nextFilter);
    window.history.replaceState(null, '', `${url.pathname}${url.search}#resources`);
  }

  return (
    <div className="resource-explorer">
      <div className="resource-filter" aria-label="按学习资源类型筛选">
        {(Object.keys(filterLabels) as ResourceFilter[]).map((type) => {
          const count = type === 'all'
            ? resources.length
            : resources.filter((resource) => resource.type === type).length;
          return (
            <button
              className={filter === type ? 'active' : ''}
              key={type}
              onClick={() => selectFilter(type)}
              type="button"
            >
              {filterLabels[type]} <span>{count}</span>
            </button>
          );
        })}
      </div>

      <p className="resource-result" aria-live="polite">
        <strong>{visibleResources.length}</strong> 项学习资源
      </p>

      <div className="resource-grid">
        {visibleResources.map((resource, index) => (
          <article
            className={`resource-card${resource.featured ? ' resource-card-featured' : ''}`}
            key={resource.id}
          >
            <div className="resource-card-meta">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{resourceTypeLabels[resource.type]}</span>
            </div>
            <p className="resource-level">{resource.level} · {resource.source}</p>
            <h3>
              <a href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>
            </h3>
            <p className="resource-creators">
              {resource.creators.length > 5
                ? `${resource.creators.slice(0, 5).join(', ')} +${resource.creators.length - 5}`
                : resource.creators.join(', ')}
            </p>
            <p className="resource-description">{resource.descriptionZh}</p>
            <div className="resource-card-foot">
              <div className="resource-tags">
                {resource.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <a href={resource.url} target="_blank" rel="noreferrer" aria-label={`打开学习资源：${resource.title}`}>↗</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
