-- CreateTable
CREATE TABLE "_ComponentToDesignToken" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ComponentToOcticon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ComponentToDesignToken_AB_unique" ON "_ComponentToDesignToken"("A", "B");

-- CreateIndex
CREATE INDEX "_ComponentToDesignToken_B_index" ON "_ComponentToDesignToken"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ComponentToOcticon_AB_unique" ON "_ComponentToOcticon"("A", "B");

-- CreateIndex
CREATE INDEX "_ComponentToOcticon_B_index" ON "_ComponentToOcticon"("B");

-- AddForeignKey
ALTER TABLE "_ComponentToDesignToken" ADD CONSTRAINT "_ComponentToDesignToken_A_fkey" FOREIGN KEY ("A") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentToDesignToken" ADD CONSTRAINT "_ComponentToDesignToken_B_fkey" FOREIGN KEY ("B") REFERENCES "DesignToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentToOcticon" ADD CONSTRAINT "_ComponentToOcticon_A_fkey" FOREIGN KEY ("A") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentToOcticon" ADD CONSTRAINT "_ComponentToOcticon_B_fkey" FOREIGN KEY ("B") REFERENCES "Octicon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
