import { Job, Worker, ShortlistItem } from '../types';

export const matchEngine = {
  buildShortlist: (job: Job, workers: Worker[]): ShortlistItem[] => {
    const items: ShortlistItem[] = workers.map(worker => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Profession Match (+50)
      // Simple string comparison. In real app, might need normalization or fuzzy match.
      if (worker.profession_primary === job.profession_required) {
        score += 50;
        reasons.push(`Profesión principal coincide: ${worker.profession_primary}`);
      }

      // 2. Tags Match (+25)
      // Check if any tag matches parts of the job title or profession
      const jobKeywords = (job.title + ' ' + job.profession_required).toLowerCase().split(' ');
      const hasTagMatch = worker.tags.some(tag => 
        jobKeywords.some(keyword => keyword.length > 2 && tag.toLowerCase().includes(keyword))
      );
      if (hasTagMatch) {
        score += 25;
        reasons.push("Tags relevantes encontrados");
      }

      // 3. Documentation Match (+20 or +10)
      if (job.documentation_required.length > 0) {
        const hasDoc = job.documentation_required.some(req => 
          worker.documentation_type.includes(req) || req === 'Cualquiera'
        );
        if (hasDoc) {
          score += 20;
          reasons.push("Documentación compatible");
        }
      } else {
        score += 10; // Job doesn't require specific doc, good for everyone
      }

      // 4. Languages (+10 each, max 30)
      let langScore = 0;
      const matchedLangs: string[] = [];
      job.languages_required.forEach(reqLang => {
        if (worker.languages.some(wl => wl.includes(reqLang))) {
          langScore += 10;
          matchedLangs.push(reqLang);
        }
      });
      langScore = Math.min(langScore, 30);
      if (langScore > 0) {
        score += langScore;
        reasons.push(`Idiomas: ${matchedLangs.join(', ')}`);
      }

      // 5. Location Country Match (+10)
      // Assumes format "City, Country" or just "Country"
      if (job.location_country) {
        if (worker.location.toLowerCase().includes(job.location_country.toLowerCase())) {
          score += 10;
          reasons.push(`Ubicación en ${job.location_country}`);
        }
      }

      // 6. Status Penalties
      if (worker.status === 'blocked') {
        score -= 50;
        reasons.push("⚠️ Trabajador Bloqueado");
      } else if (worker.status === 'standby') {
        score -= 20;
        reasons.push("⚠️ Trabajador en Standby");
      }

      return {
        worker_id: worker.id,
        score: Math.max(0, score), // Floor at 0
        reasons,
        status: 'suggested'
      };
    });

    // Sort by score desc
    return items.sort((a, b) => b.score - a.score);
  }
};
