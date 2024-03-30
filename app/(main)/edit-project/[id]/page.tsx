import { ProjectInterface } from "@/common.types";
import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getProjectDetails, getProjectForEditingDetails } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function EditProject({ params: { id } }: { params: { id: string } }) {
    try {
        const session = await getCurrentUser()
        if (!session?.user) redirect('/')

        const result = await getProjectForEditingDetails(id) as { project?: ProjectInterface }
        return (
            <Modal>
                <h3 className="modal-head-text">Edit the Project</h3>
                <ProjectForm type='edit' session={session} project={result?.project} />
            </Modal>
        )

    } catch (error) {
        console.log(error)
    }
}

