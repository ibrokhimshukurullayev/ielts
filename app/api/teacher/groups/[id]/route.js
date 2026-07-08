import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET(_request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: { include: { student: { select: { id: true, name: true, username: true } } } } },
    });

    if (!group || group.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    return Response.json({
      group: {
        id: group.id,
        name: group.name,
        createdAt: group.createdAt,
        members: group.members.map((m) => ({ id: m.student.id, name: m.student.name, username: m.student.username })),
      },
    });
  } catch (err) {
    console.error("[/api/teacher/groups/[id] GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const { name } = await request.json();
    if (!name?.trim()) {
      return Response.json({ error: "Group name is required." }, { status: 400 });
    }

    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    const updated = await prisma.group.update({ where: { id }, data: { name: name.trim() } });
    return Response.json({ group: { id: updated.id, name: updated.name } });
  } catch (err) {
    console.error("[/api/teacher/groups/[id] PATCH]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    await prisma.group.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[/api/teacher/groups/[id] DELETE]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
