import Link from "@material-ui/core/Link";
import { memo } from "react";
import type { FunctionComponent } from "react";
import type { Report, ReportDuplicatedFile } from "crawler";

const GitHubCommitLink: FunctionComponent<{
  file: ReportDuplicatedFile;
  repositoryFullName: string;
  revision: Report["statistics"]["revision"];
}> = memo(({ file, repositoryFullName, revision }) => {
  const fileNameMatches = file.name.match(/repository-.{6}\/(.*)$/);
  const filePath = fileNameMatches?.[1] ?? file.name;

  return (
    <Link
      href={`https://github.com/${repositoryFullName}/blob/${revision}/${filePath}#L${file.start}-L${file.end}`}
      rel="noopener"
      target="_blank"
    >
      {filePath}&emsp;lines {file.start}-{file.end}
    </Link>
  );
});

export { GitHubCommitLink };
